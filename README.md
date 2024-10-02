# `discord.js-anticrash`: ⚡ Powerful Error Handling for Discord.js

[![NPM Version](https://img.shields.io/npm/v/discord.js-anticrash?style=for-the-badge)](https://www.npmjs.com/package/discord.js-anticrash)
[![Repository Size](https://img.shields.io/github/repo-size/Alpha5959/discord.js-anticrash?style=for-the-badge)](https://github.com/Alpha5959/discord.js-anticrash)
[![License](https://img.shields.io/npm/l/discord.js-anticrash?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/discord.js-anticrash?style=for-the-badge)](https://www.npmjs.com/package/discord.js-anticrash)
[![Support](https://img.shields.io/badge/Support-Discord-7289d9?style=for-the-badge&logo=discord)](https://discord.com/invite/Rw5gRVqSaK)

**discord.js-anticrash** is a lightweight and efficient package designed to enhance the stability of your Discord bot built with Discord.js. It automatically handles errors and crashes to ensure your bot stays online and operational with minimal downtime.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Features

- **Automatic Error Recovery**: Automatically restarts your bot if it crashes due to uncaught exceptions or unhandled promise rejections.
- **Customizable Logging**: Easily log errors and events to your preferred logging service or console for better monitoring.
- **User-Friendly API**: Simple to integrate and use with your existing Discord.js bot setup.

## Installation

To install **discord.js-anticrash**, use the following command:

```bash
npm install discord.js-anticrash
```

## Usage

Here's a simple example of how to integrate **discord.js-anticrash** into your bot:

```javascript
const { Client } = require('discord.js');
const Anticrash = require('discord.js-anticrash');

const client = new Client();
Anticrash(client); // Enable anti-crash features

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login('YOUR_BOT_TOKEN');
```

### TypeScript & ES Modules Usage

For TypeScript or ES Modules (`.mjs`), you can import and use the package like this:

```typescript
import { Client } from 'discord.js';
import Anticrash from 'discord.js-anticrash';

const client = new Client();
Anticrash(client); // Enable anti-crash features

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login('YOUR_BOT_TOKEN');
```

## API Reference

### `Anticrash(client: Client): void`

- **Description**: Initializes the anti-crash features for your Discord.js client.
- **Parameters**: 
  - `client`: The instance of your Discord.js client.
- **Returns**: Nothing.

## Error Handling

**discord.js-anticrash** provides robust error handling. When an error occurs, it logs the error message and stack trace for easier troubleshooting.

Example of a logged error:

```
✖ ERROR: Unhandled Promise Rejection
  └─ Stack Trace:
Error: Some error message
```

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.

## Contributing

Contributions are welcome! If you'd like to help improve **discord.js-anticrash**, please open an issue or submit a pull request on GitHub. All contributions should follow coding best practices and include relevant test cases.

## Acknowledgments

- [Discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API.
- Special thanks to everyone who has contributed to this package!
