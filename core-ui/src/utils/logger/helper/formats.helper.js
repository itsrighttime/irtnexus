import { COLORS } from "./colors.helper";
import { getTime } from "./time.helper";
/**
 * formatMessage
 *
 * Formats a log message with timestamp, service, level, and optional context/code.
 */
export const formatMessage = ({ level, serviceName, message, context = null, code = "NA", }) => {
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
