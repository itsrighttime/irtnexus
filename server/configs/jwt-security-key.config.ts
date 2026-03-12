export const getJWT_Key = (keyFor: string) => {
  switch (keyFor) {
    case "socket":
      return "SECURITY_KEY_FOR_SOCKET";
    default:
      return "DEFAULT_SECURITY_KEY";
  }
};
