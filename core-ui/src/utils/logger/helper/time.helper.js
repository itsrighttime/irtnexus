export const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // HH:mm:ss
};
