import { WebhookClient, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { logError, logWarning, logInfo } from "../utils/logger";

const errorRateLimit = new Set<string>();
const RateLimit = 10000;

export default async function errorHandling(client: any, config: any) {
    process.removeAllListeners();

    const { webhookUrl, embedColor = "ff0000", embedTitle = "Error", webhookUsername = "Error", embedAvatarUrl = "" } = config;

    if (!webhookUrl) {
        const error = new Error("Webhook URL is required.");
        logError(error);
        throw error;
    }

    const webhook = new WebhookClient({ url: webhookUrl });

    const sendErrorMessage = async (error: Error | string, eventType: string, additionalInfo: string = ""): Promise<void> => {
        const errorKey = `${eventType}-${additionalInfo}`;
        if (errorRateLimit.has(errorKey)) return;

        errorRateLimit.add(errorKey);
        setTimeout(() => errorRateLimit.delete(errorKey), RateLimit);

        const errorMessage = error instanceof Error ? error.stack || "No stack available" : String(error);

        const embed = new EmbedBuilder()
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

        try {
            await webhook.send({
                username: webhookUsername,
                avatarURL: embedAvatarUrl,
                embeds: [embed],
            });

            if (errorMessage.length > 4076) {
                await webhook.send({
                    username: webhookUsername,
                    avatarURL: embedAvatarUrl,
                    files: [
                        new AttachmentBuilder(Buffer.from(errorMessage, "utf-8"), { name: "error.txt" }),
                    ],
                });
            }            
        } catch (sendError: any) {
            logError(`Error sending error message: ${sendError?.message || "Unknown error"}`);
        }
    };

    const handleError = (error: Error | string, eventType: string, additionalInfo: string = "") => {
        logError(error);
        if (eventType === "warning") {
            logWarning(typeof error === "string" ? error : error.message);
        } else if (eventType === "exit") {
            logInfo(`Exiting with code and signal: ${additionalInfo}`);
        } else {
            sendErrorMessage(error, eventType, additionalInfo);
        }
    };

    const processEventListeners: { [key: string]: { listener: (...args: any[]) => void } } = {
        unhandledRejection: {
            listener: (reason, promise) => handleError(reason instanceof Error ? reason : new Error(String(reason)), "unhandledRejection", `Promise: ${promise}`),
        },
        uncaughtException: {
            listener: (error, origin) => handleError(error instanceof Error ? error : new Error(String(error)), "uncaughtException", `Origin: ${origin}`),
        },
        uncaughtExceptionMonitor: {
            listener: (error, origin) => handleError(error instanceof Error ? error : new Error(String(error)), "uncaughtExceptionMonitor", `Origin: ${origin}`),
        },
        warning: {
            listener: (warning) => handleError(warning instanceof Error ? warning : new Error(String(warning)), "warning"),
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
                handleError(err instanceof Error ? err : new Error(String(err)), "listenerError", `Event: ${event}`);
            }
        });        
    }
}
