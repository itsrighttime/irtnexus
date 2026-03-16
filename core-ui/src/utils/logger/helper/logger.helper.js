import { formatMessage } from "./formats.helper.js";
export const __logger = (serviceName) => {
    const logWithLevel = (level) => ({ message, context = null, code = "NA" }) => {
        const { message: baseMsg, information } = formatMessage({
            level,
            serviceName,
            message,
            context,
            code,
        });
        console.log(baseMsg, information);
    };
    const logWithError = ({ message, context = null, code = "NA", error, }) => {
        const { information, message: baseMsg } = formatMessage({
            level: "error",
            serviceName,
            message,
            context,
            code,
        });
        console.error(baseMsg, information, error);
    };
    return {
        error: logWithError,
        warn: logWithLevel("warn"),
        info: logWithLevel("info"),
        verbose: logWithLevel("verbose"),
        debug: logWithLevel("debug"),
        silly: logWithLevel("silly"),
    };
};
