import { Client } from "discord.js";

interface ErrorHandlingConfig {
  webhookUrl: string;
  embedColor?: string;
  embedTitle?: string;
  webhookUsername?: string;
  embedAvatarUrl?: string;
}

type LogLevel = "error" | "warning" | "info";

type ListenerFunction = (error: any, origin?: string) => void;

interface ProcessEventListeners {
  [eventName: string]: {
    level: LogLevel;
    listener: ListenerFunction;
  };
}

interface LogFunctions {
  error: (error: any, details?: string) => void;
  warning: (warning: string, details?: string) => void;
  info: (info: string) => void;
}

declare function errorHandling(
  client: Client,
  config: ErrorHandlingConfig
): Promise<void>;

export {
  ErrorHandlingConfig,
  LogLevel,
  ListenerFunction,
  ProcessEventListeners,
  LogFunctions,
  errorHandling,
};
