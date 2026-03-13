# RLM-Server

A terminal-based chat interface for the Recursive LLM (RLM) engine. It provides real-time progress visibility, token usage tracking, and multi-provider management via a simple JSON configuration.

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure**:
   Copy `config.example.json` to `config.json` and add your API keys.
   ```json
   {
     "providers": [
       {
         "id": "deepseek",
         "type": "openai",
         "apiKey": "sk-...",
         "model": "deepseek-chat",
         "baseURL": "https://api.deepseek.com",
         "isDefault": true
       }
     ],
     "rlmConfig": {
       "maxDepth": 3,
       "maxSubQuestions": 3,
       "maxTokens": 10000,
       "strategy": "round-robin"
     }
   }
   ```

## Usage

Start the terminal chat:
```bash
npm start
```

### Features in the Terminal

- **Real-time Progress**: Shows which provider is working on which phase (decomposition, solving, synthesis).
- **Token Tracking**: Displays token usage per step and a final aggregated total.
- **Atomic Logs**: Synchronized logging ensures parallel tasks don't scramble the terminal output.
- **Decomposition Tree**: Prints a visual tree of how your question was broken down.

## Development

This server links to the local `@yuemi-development/rlm-js` library. Any changes made in the library project (after building) will be reflected here.
