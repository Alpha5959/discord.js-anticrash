# `discord.js-anticrash`: ⚡ Advanced Error Handling for Discord.js

<p align="center">
  <a href="https://www.npmjs.com/package/discord.js-anticrash">
    <img src="https://img.shields.io/npm/v/discord.js-anticrash?color=%23ff69b4&label=npm%20version&style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/discord.js-anticrash">
    <img src="https://img.shields.io/npm/dt/discord.js-anticrash?color=%233cb371&label=downloads&style=flat-square" alt="npm downloads">
  </a>
  <a href="https://github.com/Alpha5959/discord.js-anticrash/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Alpha5959/discord.js-anticrash?color=%23008080&style=flat-square" alt="GitHub license">
  </a>
  <a href="https://github.com/Alpha5959/discord.js-anticrash/issues">
    <img src="https://img.shields.io/github/issues/Alpha5959/discord.js-anticrash?color=%23ff6347&style=flat-square" alt="GitHub issues">
  </a>
</p>

**Presenting `discord.js-anticrash`**, a robust error-handling package tailored for Discord.js. Empower your bot with seamless handling of errors, uncaught exceptions, unhandled rejections, and more. With `discord.js-anticrash`, configuring your bot to dispatch detailed error messages to a Discord webhook becomes a breeze, ensuring you stay informed when the unexpected happens.

## Features 🚀

- **🔒 Secure**: Guard your bot against unexpected crashes with proactive error identification and handling.
- **🔔 Notifications**: Receive instant notifications via Discord webhook when errors occur.
- **🛠 Customizable**: Tailor the package to your needs – customize webhook URL, embed color, title, and username.

## Installation 📦

Get started by installing `discord.js-anticrash` using npm:

```bash
npm install discord.js-anticrash
```

## Usage 🤖

To implement `discord.js-anticrash`, import the package and invoke the `errorHandling` function, providing your Discord.js client and configuration options:

```javascript
const { Client, GatewayIntentBits, Events } = require("discord.js");
const errorHandling = require("discord.js-anticrash");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const config = {
  webhookUrl: "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN",
  embedColor: "#ff0000", // Optional
  embedTitle: "Error", // Optional
  embedAvatarUrl: "https://cdn.discordapp.com/avatars/example", // Optional
  webhookUsername: "Error", // Optional
};

errorHandling(client, config);

client.login("BotToken"); // Your Discord Bot token goes here.
```

## Configuration ⚙️

Customize the behavior of `discord.js-anticrash` with the `config` object:

- **webhookUrl (required)**: The URL of the Discord webhook to send error messages.
- **embedColor (optional)**: The color of the embed message (default: `#ff0000`).
- **embedTitle (optional)**: The title of the embed message (default: `Error`).
- **embedTitle (optional)**: The title of the embed message (default: `Error`).
- **embedAvatarUrl (optional)**: The title of the embed message (default: `None`).
- **webhookUsername (optional)**: The username for the webhook (default: `Error`).

## Error Handling 🚨

`discord.js-anticrash` delivers advanced error handling for Discord.js v14:

- **unhandledRejection**: Handles unhandled rejections, sending detailed error messages to the Discord webhook.
- **uncaughtException**: Manages uncaught exceptions, dispatching detailed error messages to the Discord webhook.
- **uncaughtExceptionMonitor**: Monitors uncaught exceptions and sends detailed error messages to the Discord webhook.
- **warning**: Deals with warnings, forwarding detailed warning messages to the Discord webhook.
- **exit**: Manages bot exit events, sending detailed exit messages to the Discord webhook.

## Example 🌐

Witness `discord.js-anticrash` in action, handling errors and uncaught exceptions:

```javascript
const { Client, GatewayIntentBits, Events } = require("discord.js");
const errorHandling = require("discord.js-anticrash");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const config = {
  webhookUrl: "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN", // REQUIRED
  embedColor: "#ff0000", // Optional
  embedTitle: "Error", // Optional
  webhookUsername: "Error", // Optional
};

errorHandling(client, config);

client.on(Events.MessageCreate, (message) => {
  if (message.content === "!crash") {
    throw new Error("Simulated crash!"); // Example test.
  }
});

client.login("BotToken"); // Your Discord Bot token goes here.
```

## License 📜

`discord.js-anticrash` is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). This license allows you to use, modify, and distribute the package under certain conditions.
Please review the [LICENSE](https://github.com/Alpha5959/discord.js-anticrash/blob/main/LICENSE) file for the full text of the Apache License 2.0.
By using or contributing to this project, you agree to abide by the terms specified in the license.

## Conclusion 🎉

**`discord.js-anticrash` is your go-to solution for Discord.js bot development**, ensuring security, reliability, and ease of maintenance. With advanced error handling, customizable configurations, and detailed error messages, **`discord.js-anticrash`** elevates your Discord.js error handling experience.
