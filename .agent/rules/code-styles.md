---
trigger: always_on
---

# Formatting & Style Rules (Strict)

## JavaScript Module System

All **JavaScript (.js)** files in this project MUST use **CommonJS** syntax.

### Rules
- Use `require()` instead of `import`
- Use `module.exports` instead of `export`
- Do NOT use ES Modules syntax in `.js` files

### Examples

✅ Correct (CommonJS)
```js
const fs = require("fs");

module.exports = {
  readConfig,
};
```

❌ Incorrect (ESM in JS files)
```js
import fs from "fs";
export default {};
```

---

## Indentation

* **Indentation: 2 spaces**
* **No tabs** (tabs are forbidden)

Correct:

```js
if (isAuthenticated) {
  redirectToDashboard()
}
```

Wrong:

```js
if (isAuthenticated) {
    redirectToDashboard()
}
```

---

## Line Length

* **Max line length: 100 characters**
* Break long expressions into multiple lines

Correct:

```js
const isUserEligible =
  user.age >= MIN_AGE &&
  user.isVerified &&
  user.subscriptionStatus === 'active'
```

---

## Quotes

* **Single quotes only**

Correct:

```js
const role = 'admin'
```

---

## Semicolons

* **No semicolons**
* Rely on automatic semicolon insertion (ASI)

Correct:

```js
const fetchData = async () => {
  return response
}
```

Wrong:

```js
const fetchData = async () => {
  return response;
}
```

---

## Trailing Commas

* **Always use trailing commas** in multiline objects, arrays, and imports

Correct:

```js
const config = {
  retries: 3,
  timeout: 5000,
}
```

---

## Spacing

* One space after keywords
* One space around operators
* No extra spaces inside parentheses

Correct:

```js
if (count > 0) {
  handleIncrement()
}
```

Wrong:

```js
if(count>0){
  handleIncrement()
}
```

---

## Blank Lines

* One blank line between:

  * Logical blocks
  * Function declarations
  * Import groups

Correct:

```js
const fs = require('fs')

const { fetchUser } = require('./services/userService')

const getUserProfile = () => {
  return null
}
```

---

## Import Order

1. Node / framework imports
2. Third-party libraries
3. Internal absolute imports
4. Relative imports

Each group separated by **one blank line**

---

## Arrow Functions

* Prefer arrow functions
* Always use parentheses, even for single params

Correct:

```js
const handleClick = (event) => {
  processEvent(event)
}
```

---

## Comments

* Comments must explain **why**, not **what**
* No redundant comments

Bad:

```js
// set user to null
setUser(null)
```

Good:

```js
// Reset state when session expires
setUser(null)
```

---

# Tooling Alignment

These rules are intended to be enforced by:

* ESLint
* Prettier

AI-generated code **must already comply** before linting.
