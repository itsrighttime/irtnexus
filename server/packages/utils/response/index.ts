import { FastifyRequest, FastifyReply } from "fastify";
import { HTTP_STATUS } from "./httpStatus";
import { STATUS, StatusType } from "./status";

/** Response payload type */
interface ResponsePayload<T = any> {
  status?: StatusType;
  code?: number;
  message?: string;
  data?: T | null;
  uniqueCode?: string;
  redirectUrl?: string;
  meta?: Record<string, any>;
  errors?: Record<string, string>;
}

/** Generates unique codes like SECU-IN-USER_FOUND or SECU-ER-USER_NOT_FOUND */
const getUniqueCode = (code: string, type: StatusType = STATUS.SUCCESS) => {
  const prefix = type === STATUS.ERROR ? "ER" : "IN";
  return `SECU-${prefix}-${code}`;
};

class ResponseService {
  private static send = <T = any>(
    request: FastifyRequest,
    reply: FastifyReply,
    payload: ResponsePayload<T> = {},
  ) => {
    const ctx = (request as any).context || {};
    const {
      status = STATUS.SUCCESS,
      code = HTTP_STATUS.x2_OK,
      message = "N/A",
      data = null,
      uniqueCode = "N/A",
      redirectUrl = null,
      meta = {},
      errors,
    } = payload;

    const fullUniqueCode = getUniqueCode(uniqueCode, status);

    if (status === STATUS.REDIRECT && redirectUrl) {
      return reply.redirect(redirectUrl, code);
    }

    return reply.status(code).send({
      status: status,
      code,
      message,
      uniqueCode: fullUniqueCode,
      ...(data !== null && { data }),
      ...(errors && { errors }),
      meta: {
        requestId: ctx.requestId,
        ...(ctx.auditId && { auditId: ctx.auditId }),
        ...meta,
      },
    });
  };

  static success = <T = any>(
    request: FastifyRequest,
    reply: FastifyReply,
    data: T | null = null,
    message = "Success",
    uniqueCode = "N/A",
    meta: Record<string, any> = {},
  ) => {
    return this.send(request, reply, {
      status: STATUS.SUCCESS,
      code: HTTP_STATUS.x2_OK,
      message,
      data,
      uniqueCode,
      meta,
    });
  };

  static error = (
    request: FastifyRequest,
    reply: FastifyReply,
    errors: Record<string, string>,
    message = "Internal Server Error",
    uniqueCode = "N/A",
    code: number = HTTP_STATUS.x5_INTERNAL_SERVER_ERROR,
    meta: Record<string, any> = {},
  ) => {
    return this.send(request, reply, {
      status: STATUS.ERROR,
      code,
      message,
      data: null,
      uniqueCode,
      errors,
      meta,
    });
  };

  static info = (
    request: FastifyRequest,
    reply: FastifyReply,
    message: string,
    data: any = null,
    uniqueCode = "N/A",
    code: number = HTTP_STATUS.x2_OK,
    meta: Record<string, any> = {},
  ) => {
    return this.send(request, reply, {
      status: STATUS.INFO,
      code,
      message,
      data,
      uniqueCode,
      meta,
    });
  };
}

const response = {
  success: ResponseService.success,
  error: ResponseService.error,
  info: ResponseService.info,
};

export { response, STATUS, HTTP_STATUS };
