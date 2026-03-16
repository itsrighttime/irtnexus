export const COLORS = {
    reset: "\x1b[0m",
    timestamp: "\x1b[2;37m", // Dim white
    levels: {
        error: "\x1b[1;31m", // Red bold
        warn: "\x1b[1;33m", // Yellow bold
        info: "\x1b[1;32m", // Green bold
        verbose: "\x1b[1;36m", // Cyan bold
        debug: "\x1b[1;34m", // Blue bold
        silly: "\x1b[1;35m", // Magenta bold
    },
    service: "\x1b[1;3;95m", // Magenta bold italic
};
