import type { Client } from 'discord.js';

interface ErrorHandlingConfig {
  webhookUrl: string;
  embedColor?: string;
  embedTitle?: string;
  webhookUsername?: string;
}

declare function errorHandling(
  client: Client,
  config: ErrorHandlingConfig
): Promise<void>;

export = errorHandling;
