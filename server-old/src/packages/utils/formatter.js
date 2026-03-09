import { formatter, dateTime, AESUtil } from "@itsrighttime/utils";

// ----------- EXPORT UTILS LOGGER -----------

export const UtilsFormatter = {
  ...formatter,
  ...dateTime,
  AESUtil,
};
