const { WebhookClient, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const colors = require("colors");

module.exports = async function errorHandling(client, config) {
  process.removeAllListeners();

  const webhookUrl = config.webhookUrl;
  if (!webhookUrl) {
    logError(new Error("Webhook URL is required."));
    throw new Error("Webhook URL is required.");
  }

  const webhook = new WebhookClient({ url: webhookUrl });

  const defaultConfig = {
    embedColor: "ff0000",
    embedTitle: "Error",
    webhookUsername: "Error",
    embedAvatarUrl: "",
  };

  const embedConfig = { ...defaultConfig, ...config };

  const sendErrorMessage = async (error, eventType, additionalInfo = "") => {
    try {
      let errorMessage = error instanceof Error ? error.stack : String(error);

      await webhook.send({
        username: embedConfig.webhookUsername,
        avatarURL: embedConfig.embedAvatarUrl,
        embeds: [
          new EmbedBuilder()
            .setColor(embedConfig.embedColor)
            .setTimestamp()
            .setTitle(`${eventType.toUpperCase()} - ${embedConfig.embedTitle}`)
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
                value: `**\`${additionalInfo.slice(0, 1017) || "No Additional Info Provided"
                  }\`**`,
                inline: true,
              }
            ])
            .setDescription(`"__Detailed__"\n\`\`\`${errorMessage.slice(0, 4074) || "Nothing found here."}\`\`\``)
          ,
        ],
      });

      if (errorMessage.length > 4074) {
        await webhook.send({
          username: embedConfig.webhookUsername,
          avatarURL: embedConfig.embedAvatarUrl,
          files: [
            new AttachmentBuilder()
              .setName("error.txt")
              .setFile(Buffer.from(errorMessage, "utf-8"))
              .setSpoiler(false)
          ]
        });
      }
    } catch (error) {
      console.error(colors.bgRed("Error sending error message:"), error);
    }
  };

  const processEventListeners = {
    unhandledRejection: {
      level: "critical",
      listener: (reason, promise) =>
        sendErrorMessage(reason, "Unhandled Rejection", `Promise: ${promise}`),
    },
    uncaughtException: {
      level: "error",
      listener: (error, origin) => {
        logError(error);
        sendErrorMessage(error, "Uncaught Exception", `Origin: ${origin}`);
      },
    },
    uncaughtExceptionMonitor: {
      level: "warning",
      listener: (error, origin) => {
        logWarning(`Uncaught Exception Monitor: ${origin}`);
        sendErrorMessage(
          error,
          "Uncaught Exception Monitor",
          `Origin: ${origin}`
        );
      },
    },
    warning: {
      level: "warning",
      listener: (warning) => {
        logWarning(warning);
        sendErrorMessage(warning, "Warning");
      },
    },
    exit: {
      level: "info",
      listener: (code, signal) => {
        logInfo(`Exiting with code ${code} and signal ${signal}`);
        const error = new Error(
          `Exiting with code ${code} and signal ${signal}`
        );
        sendErrorMessage(
          error,
          "Exit",
          `Exiting with code ${code} and signal ${signal}`
        );
      },
    },
  };

  for (const [event, listenerConfig] of Object.entries(processEventListeners)) {
    process.on(event, async (...args) => {
      try {
        await listenerConfig.listener(...args);
      } catch (error) {
        const { level } = listenerConfig;
        log[level](
          colors.bgRed(`Error in process event listener: ${event}`, error)
        );
      }
    });
  }

  // Coloring Functions

  const log = {
    error: logError,
    warning: logWarning,
    info: logInfo,
  };

  function generateBorder(borderStyle, borderLength) {
    const { top, horizontal, vertical, bottom } = borderStyle;
    const borderLine = horizontal.repeat(borderLength);
    const topBorder = top + borderLine + top;
    const bottomBorder = bottom + borderLine + bottom;
    return { topBorder, bottomBorder, vertical };
  }

  function logError(error, details = "") {
    const timestamp = new Date().toLocaleString();
    const errorMessage =
      error instanceof Error
        ? error.message
        : error.toString() || "No error message provided.";
    const origin =
      error instanceof Error ? `(${error.stack.split("\n")[1].trim()})` : "";
    const borderLength = Math.max(
      errorMessage.length + 20,
      timestamp.length + origin.length + 20
    );
    const paddingLength = Math.max(
      0,
      borderLength - errorMessage.length - timestamp.length - 10
    );

    const borderStyle = {
      top: "╔",
      horizontal: "═",
      vertical: "║",
      bottom: "╚",
    };

    const { topBorder, bottomBorder, vertical } = generateBorder(
      borderStyle,
      borderLength
    );
    const paddedError =
      " ".repeat(2) + colors.gray(errorMessage) + " ".repeat(paddingLength);
    const paddedOrigin = colors.red(origin) + " ".repeat(paddingLength);

    console.error(topBorder);
    console.error(
      vertical + colors.bgRed.bold(` ERROR `) + colors.red(` [${timestamp}] `)
    );
    console.error(vertical + colors.red.bold(paddedError) + vertical);
    console.error(vertical + colors.red.bold(paddedOrigin) + vertical);
    if (details) {
      console.error(
        vertical +
        " ".repeat(2) +
        colors.red.bold(details) +
        " ".repeat(paddingLength) +
        vertical
      );
    }
    console.error(bottomBorder);
  }

  function logWarning(warning, details = "") {
    const timestamp = new Date().toLocaleString();
    const borderLength = warning.length + 30;
    const paddingLength = Math.max(
      0,
      borderLength - warning.length - timestamp.length - 11
    );

    const borderStyle = {
      top: "╔",
      horizontal: "═",
      vertical: "║",
      bottom: "╚",
    };

    const { topBorder, bottomBorder, vertical } = generateBorder(
      borderStyle,
      borderLength
    );
    const paddedWarning = " ".repeat(2) + warning + " ".repeat(paddingLength);
    const timestampLine = " ".repeat(2) + timestamp + " ".repeat(2);

    console.warn(topBorder);
    console.warn(
      vertical +
      colors.bgYellow.black.bold(` WARNING `) +
      colors.yellow(` [${timestamp}] `)
    );
    console.warn(vertical + colors.yellow.bold(paddedWarning) + vertical);
    if (details) {
      console.warn(
        vertical +
        " ".repeat(2) +
        colors.yellow.bold(details) +
        " ".repeat(paddingLength) +
        vertical
      );
    }
    console.warn(vertical + colors.yellow.bold(timestampLine) + vertical);
    console.warn(bottomBorder);
  }

  function logInfo(info) {
    const timestamp = new Date().toLocaleString();
    const borderLength = info.length + 22;
    const paddingLength = Math.max(
      0,
      borderLength - info.length - timestamp.length - 11
    );

    const borderStyle = {
      top: "╔",
      horizontal: "═",
      vertical: "║",
      bottom: "╚",
    };

    const { topBorder, bottomBorder, vertical } = generateBorder(
      borderStyle,
      borderLength
    );
    const paddedInfo = " ".repeat(2) + info + " ".repeat(paddingLength);
    const timestampLine = " ".repeat(2) + timestamp + " ".repeat(2);

    console.log(topBorder);
    console.log(
      vertical + colors.bgCyan.bold(` INFO `) + colors.cyan(` [${timestamp}] `)
    );
    console.log(vertical + colors.cyan.bold(paddedInfo) + vertical);
    console.log(vertical + colors.cyan.bold(timestampLine) + vertical);
    console.log(bottomBorder);
  }
};
