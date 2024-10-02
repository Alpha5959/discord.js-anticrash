function formatLogMessage(message, type) {
    const timestamp = new Date().toLocaleString();
    let formattedMessage = '';
  
    switch (type) {
      case 'error':
        formattedMessage = `\n\x1b[41m\x1b[1m\x1b[30m✖ ERROR \x1b[0m \x1b[90m${timestamp}\x1b[0m\n  └─ ${message}`;
        break;
      case 'warn':
        formattedMessage = `\n\x1b[43m\x1b[1m\x1b[30m⚠ WARN \x1b[0m \x1b[90m${timestamp}\x1b[0m\n  └─ ${message}`;
        break;
      case 'info':
        formattedMessage = `\n\x1b[46m\x1b[1m\x1b[30mℹ INFO \x1b[0m \x1b[90m${timestamp}\x1b[0m\n  └─ ${message}`;
        break;
      default:
        formattedMessage = `\n\x1b[90m${timestamp}\x1b[0m\n  └─ ${message}`;
    }
  
    return formattedMessage;
  }
  
  export function logError(message) {
    const formattedMessage = formatLogMessage(message, 'error');
    console.error(formattedMessage);
  }
  
  export function logWarning(message) {
    const formattedMessage = formatLogMessage(message, 'warn');
    console.warn(formattedMessage);
  }
  
  export function logInfo(message) {
    const formattedMessage = formatLogMessage(message, 'info');
    console.log(formattedMessage);
  }
  
  export default formatLogMessage;
  