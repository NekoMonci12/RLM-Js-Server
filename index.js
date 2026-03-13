const readline = require('readline')
const fs = require('fs')
const path = require('path')

const { 
  LLMService, 
  RLMEngine,
  createOpenAIProvider,
  createAnthropicProvider,
  createOpenRouterProvider,
} = require('@yuemi-development/rlm-js')

// Load configuration
const configPath = path.join(__dirname, 'config.json')
const configExamplePath = path.join(__dirname, 'config.example.json')

if (!fs.existsSync(configPath)) {
  console.log('No config.json found. Copying config.example.json to config.json...')
  fs.copyFileSync(configExamplePath, configPath)
}

let config
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} catch (error) {
  console.error('Error parsing config.json:', error.message)
  process.exit(1)
}

let logQueue = Promise.resolve()

const safeLog = (...args) => {
  logQueue = logQueue.then(() => {
    console.log(...args)
  })
  return logQueue
}

const setupTerminal = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'RLM> ',
  })

  // Initialize LLM Service
  const llm = new LLMService()
  
  // Wrap completion to show progress
  const originalCompletion = llm.completion.bind(llm)
  llm.completion = async (messages, options) => {
    const providerId = options?.providerId || llm.defaultProviderId || 'unknown'
    const label = options?.label || 'processing'
    
    // Use queue to avoid interleaving with other logs
    safeLog(`[${providerId}] starting ${label}...`)
    
    const startTime = Date.now()
    try {
      const result = await originalCompletion(messages, options)
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      
      const usageStr = result.usage 
        ? `(${result.usage.promptTokens}+${result.usage.completionTokens}=${result.usage.totalTokens} tokens)`
        : '(no usage data)'
        
      safeLog(`[${providerId}] ${label} done (${duration}s) ${usageStr}`)
      return result
    } catch (error) {
      safeLog(`[${providerId}] ${label} failed!`)
      throw error
    }
  }
  
  // Register providers from config
  if (config.providers && Array.isArray(config.providers)) {
    config.providers.forEach((p) => {
      try {
        let completionFn
        switch (p.type) {
          case 'openai':
            completionFn = createOpenAIProvider(p.apiKey, p.baseURL, p.model, p.headers)
            break
          case 'anthropic':
            completionFn = createAnthropicProvider(p.apiKey, p.model)
            break
          case 'openrouter':
            completionFn = createOpenRouterProvider(p.apiKey, p.model, p.referrals)
            break
          case 'dummy':
            completionFn = async (messages) => {
              const lastMessage = messages[messages.length - 1].content
              const usage = { promptTokens: 10, completionTokens: 5, totalTokens: 15 }
              
              if (lastMessage.includes('isComplex')) {
                return {
                  content: JSON.stringify({
                    isComplex: true,
                    subQuestions: ['What is task 1?', 'What is task 2?'],
                  }),
                  usage,
                }
              }
              return { 
                content: 'This is a mock response from the dummy provider.',
                usage,
              }
            }
            break
          default:
            console.warn(`Unknown provider type: ${p.type} for ID: ${p.id}`)
            return
        }
        
        llm.register(p.id, completionFn, p.isDefault)
        safeLog(`Registered provider: ${p.id} (${p.type})`)
      } catch (e) {
        console.error(`Failed to register provider ${p.id}:`, e.message)
      }
    })
  }

  const registeredIds = llm.getRegisteredProviderIds()
  if (registeredIds.length === 0) {
    console.error('No LLM providers registered. Please check config.json.')
    process.exit(1)
  }

  // Initialize Engine
  const rlmConfig = {
    maxDepth: config.rlmConfig?.maxDepth ?? 3,
    maxSubQuestions: config.rlmConfig?.maxSubQuestions ?? 3,
    maxTokens: config.rlmConfig?.maxTokens,
    decompositionProviderId: config.rlmConfig?.decompositionProviderId,
    synthesisProviderId: config.rlmConfig?.synthesisProviderId,
    defaultProviderId: config.rlmConfig?.defaultProviderId,
    strategy: config.rlmConfig?.strategy,
    providerPool: config.rlmConfig?.providerPool,
  }

  const engine = new RLMEngine(llm, rlmConfig)

  safeLog('\n--- Recursive LLM Terminal ---')
  safeLog('Type your question and press Enter. Type "exit" or "quit" to leave.\n')

  rl.prompt()

  rl.on('line', async (line) => {
    const input = line.trim()

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      rl.close()
      return
    }

    if (!input) {
      rl.prompt()
      return
    }

    safeLog('\nThinking...\n')

    try {
      const startTime = Date.now()
      const result = await engine.solve(input)
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)

      safeLog('--- Final Answer ---')
      safeLog(result.answer)
      safeLog(`\n(Solved in ${duration}s)`)
      
      if (result.usage) {
        safeLog(`Tokens: ${result.usage.promptTokens} prompt, ${result.usage.completionTokens} completion, ${result.usage.totalTokens} total`)
      }
      
      if (result.children && result.children.length > 0) {
        safeLog('\nDecomposition tree:')
        printTree(result)
      }
    } catch (error) {
      safeLog(`\nError: ${error.message}`)
    }

    logQueue = logQueue.then(() => {
      console.log('\n' + '-'.repeat(30) + '\n')
      rl.prompt()
    })
  }).on('close', () => {
    safeLog('\nGoodbye!')
    process.exit(0)
  })
}

const printTree = (node, indent = '') => {
  if (node.children && node.children.length > 0) {
    node.children.forEach((child, index) => {
      const isLast = index === node.children.length - 1
      const prefix = isLast ? '└── ' : '├── '
      safeLog(`${indent}${prefix}${child.question.substring(0, 60)}${child.question.length > 60 ? '...' : ''}`)
      printTree(child, indent + (isLast ? '    ' : '│   '))
    })
  }
}

setupTerminal()
