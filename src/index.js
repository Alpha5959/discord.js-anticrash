const { WebhookClient, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { logError, logWarning, logInfo } = require("../utils/logger");

const errorRateLimit = new Set();
const RateLimit = 10000;

module.exports = async function errorHandling(client, config) {
  process.removeAllListeners();

  const {
    webhookUrl,
    embedColor = "ff0000",
    embedTitle = "Error",
    webhookUsername = "Error",
    embedAvatarUrl = "",
  } = config;

  if (!webhookUrl) {
    const error = new Error("Webhook URL is required.");
    logError(error);
    throw error;
  }

  const webhookClient = new WebhookClient({ url: webhookUrl });

  const createErrorEmbed = (errorMessage, eventType, additionalInfo) => {
    return new EmbedBuilder()
      .setColor(embedColor)
      .setTimestamp()
      .setTitle(`__${eventType.toUpperCase()}__ - ${embedTitle}`)
      .setAuthor({ name: "Discord.js ‣ Anticrash" })
      .setFooter({ text: "Powered by discord.js-anticrash" })
      .addFields([
        {
          name: "__Event Type__",
          value: `\`${eventType.slice(0, 1021) || "No types provided."}\``,
          inline: true,
        },
        {
          name: "__Message__",
          value: `**\`${additionalInfo.slice(0, 1017) || "No Additional Info Provided"}\`**`,
          inline: true,
        },
      ])
      .setDescription(`__Detailed__\n\`\`\`${errorMessage.slice(0, 4076) || "Nothing found here."}\`\`\``);
  };

  const sendErrorMessage = async (error, eventType, additionalInfo = "") => {
    const errorKey = `${eventType}-${additionalInfo}`;
    if (errorRateLimit.has(errorKey)) return;

    errorRateLimit.add(errorKey);
    setTimeout(() => errorRateLimit.delete(errorKey), RateLimit);

    const errorMessage = error instanceof Error ? error.stack : String(error);
    const embed = createErrorEmbed(errorMessage, eventType, additionalInfo);

    try {
      await webhookClient.send({
        username: webhookUsername,
        avatarURL: embedAvatarUrl,
        embeds: [embed],
      });

      if (errorMessage.length > 4076) {
        await webhookClient.send({
          username: webhookUsername,
          avatarURL: embedAvatarUrl,
          files: [
            new AttachmentBuilder()
              .setName("error.txt")
              .setFile(Buffer.from(errorMessage, "utf-8"))
              .setSpoiler(false),
          ],
        });
      }
    } catch (sendError) {
      logError(new Error(`Error sending error message: ${sendError.message}`));
    }
  };

  const handleError = (error, eventType, additionalInfo = "") => {
    logError(error);
    if (eventType === "warning") {
      logWarning(error);
    } else if (eventType === "exit") {
      logInfo(`Exiting with code and signal: ${additionalInfo}`);
    } else {
      sendErrorMessage(error, eventType, additionalInfo);
    }
  };

  const processEventListeners = {
    unhandledRejection: {
      listener: (reason, promise) => handleError(reason, "unhandledRejection", `Promise: ${promise}`),
    },
    uncaughtException: {
      listener: (error, origin) => handleError(error, "uncaughtException", `Origin: ${origin}`),
    },
    uncaughtExceptionMonitor: {
      listener: (error, origin) => handleError(error, "uncaughtExceptionMonitor", `Origin: ${origin}`),
    },
    warning: {
      listener: (warning) => handleError(warning, "warning"),
    },
    exit: {
      listener: (code, signal) => handleError(new Error(`Exiting with code ${code} and signal ${signal}`), "exit", `Code: ${code}, Signal: ${signal}`),
    },
  };

  for (const [event, { listener }] of Object.entries(processEventListeners)) {
    process.on(event, async (...args) => {
      try {
        await listener(...args);
      } catch (err) {
        logError(new Error(`Error in process event listener: ${event} - ${err.message}`));
      }
    });
  }
};
