// import {
//   AppError,
//   asyncErrorHandler,
//   BadRequestError,
//   commonErrors,
//   errorHandler,
//   HttpCode,
//   InternalServerError,
//   NotFoundError,
// } from "@itsrighttime/utils";
// import { UtilsLogger } from "./logger.package";
// import { HandleErrorOptions, ErrorLike } from "./error.types";

// const { getTrackingCode, codeTypes, loggerMessageFormater } = UtilsLogger;

// export const handleError = (
//   error: ErrorLike,
//   options: HandleErrorOptions = {
//     code: "NA-LOGGER",
//     context: null,
//     isTrusted: true,
//     foldeName: "",
//   },
// ) => {
//   const formattedError: ErrorLike = { ...error };

//   if (!options.isTrusted) {
//     formattedError.message = loggerMessageFormater({
//       message: error.message ?? "Unknown error",
//       code: getTrackingCode(codeTypes.error, options.code ?? "NA-LOGGER"),
//       context: options.context,
//     });
//   }

//   errorHandler.handleError(formattedError);
// };

// export const UtilsError = {
//   AppError,
//   BadRequestError,
//   NotFoundError,
//   InternalServerError,
//   handleError,
//   asyncErrorHandler,
//   commonErrors,
//   HttpCode,
//   errorHandler,
// };
