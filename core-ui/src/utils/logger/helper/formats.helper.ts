import { COLORS, type LogLevel } from "./colors.helper";
import { getTime } from "./time.helper";

interface FormatMessageOptions {
  level: LogLevel;
  serviceName: string;
  message: string;
  context?: Record<string, unknown> | null;
  code?: string;
}

interface FormatMessageResult {
  message: string;
  information: {
    context: Record<string, unknown> | null;
    code: string;
  };
}

/**
 * formatMessage
 *
 * Formats a log message with timestamp, service, level, and optional context/code.
 */
export const formatMessage = ({
  level,
  serviceName,
  message,
  context = null,
  code = "NA",
}: FormatMessageOptions): FormatMessageResult => {
  const time = `${COLORS.timestamp}${getTime()}${COLORS.reset}`;
  const service = `${COLORS.service}${serviceName}${COLORS.reset}`;
  const levelColor = COLORS.levels[level] || COLORS.reset;

  const base = `[${service} - ${time}] ${levelColor}${level.toUpperCase()}${COLORS.reset}: ${message}\n`;

  return {
    message: base,
    information: {
      context,
      code,
    },
  };
};
