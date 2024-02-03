const { WebhookClient, EmbedBuilder } = require('discord.js');

/**
 * Initialize error handling for a Discord.js client.
 * @param client - The Discord.js client instance.
 * @param config - Configuration options for error handling.
 * @param config.webhookUrl - The URL of the Discord webhook to send error messages.
 * @param config.embedColor - The color of the embed message (default: "ff0000").
 * @param config.embedTitle - The title of the embed message (default: "Error").
 * @param config.webhookUsername - The username for the webhook (default: "Error").
 */

module.exports = async function errorHandling(client, config) {
  process.removeAllListeners();

  const webhookUrl = config.webhookUrl;
  if (!webhookUrl) {
    throw new Error('Webhook URL is required.');
  }

  const webhook = new WebhookClient({ url: webhookUrl });

  const defaultConfig = {
    embedColor: 'ff0000',
    embedTitle: 'Error',
    webhookUsername: 'Error',
  };

  const embedConfig = { ...defaultConfig, ...config };

  const sendErrorMessage = async (error, eventType, additionalInfo = '') => {
    try {
      let errorMessage = error instanceof Error ? error.stack : String(error);
      await webhook.send({
        username: embedConfig.webhookUsername,
        avatarURL: client.user.avatarURL(),
        embeds: [
          new EmbedBuilder()
            .setColor(embedConfig.embedColor)
            .setTitle(embedConfig.embedTitle)
            .setAuthor({ name: `❎ An Error Occured` })
            .setDescription(
              `**Event Type:** ${eventType}\n\`\`\`${errorMessage}\n${additionalInfo}\`\`\``
            ),
        ],
      });

      console.error(`[${eventType}]`, error, additionalInfo);
    } catch (error) {
      console.error('Error sending error message:', error);
    }
  };

  const processEventListeners = {
    unhandledRejection: {
      level: 'critical',
      listener: (reason, promise) =>
        sendErrorMessage(reason, 'Unhandled Rejection', `Promise: ${promise}`),
    },
    uncaughtException: {
      level: 'error',
      listener: (error, origin) =>
        sendErrorMessage(error, 'Uncaught Exception', `Origin: ${origin}`),
    },
    uncaughtExceptionMonitor: {
      level: 'warning',
      listener: (error, origin) =>
        sendErrorMessage(
          error,
          'Uncaught Exception Monitor',
          `Origin: ${origin}`
        ),
    },
    warning: {
      level: 'warning',
      listener: (warning) => {
        let warningMessage = warning.name
          ? `**Name:** ${warning.name}\n**Message:** ${warning.message}\n**Stack:** ${warning.stack}`
          : `**Warning:** ${warning}`;
        sendErrorMessage(warning, 'Warning', warningMessage);
      },
    },
    exit: {
      level: 'info',
      listener: (code, signal) => {
        const exitMessage = `Exiting with code ${code} and signal ${signal}`;
        const error = new Error(exitMessage);
        sendErrorMessage(error, 'Exit', exitMessage);
      },
    },
  };

  for (const [event, listenerConfig] of Object.entries(processEventListeners)) {
    process.on(event, async (...args) => {
      try {
        await listenerConfig.listener(...args);
      } catch (error) {
        const { level } = listenerConfig;
        console[level](`Error in process event listener: ${event}`, error);
      }
    });
  }
};
