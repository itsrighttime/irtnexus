// controllers/account.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { DB_RequestContext } from "#packages/database";
import { AccountService } from "../service";
import { CreateAccountInput } from "../types";
import { response } from "#packages/utils/index.js";

export const AccountController = {
  /** ---------------- CREATE ACCOUNT ---------------- */
  async createAccount(
    request: FastifyRequest<{ Body: CreateAccountInput }>,
    reply: FastifyReply,
  ) {
    const ctx = request.ctx;
    const body = request.body;

    const accountResult = await AccountService.createAccount(body, ctx);

    return response.success(
      request,
      reply,
      accountResult,
      "Account created successfully",
      "ABDXS",
    );
  },

  /** ---------------- SET PREFERENCES ---------------- */
  async setPreferences(request: FastifyRequest, reply: FastifyReply) {
    const ctx = request.ctx as DB_RequestContext;
    const { accountId } = request.params as any;
    const body = request.body as any;

    try {
      const updated = await AccountService.setPreferences(accountId, body, ctx);

      return reply.send({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      return reply.code(400).send({
        success: false,
        message: err.message,
      });
    }
  },

  /** ---------------- GET PROFILE ---------------- */
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const ctx = request.ctx as DB_RequestContext;
    const { accountId } = request.params as any;

    try {
      const profile = await AccountService.getProfile(accountId, ctx);

      return reply.send({
        success: true,
        data: profile,
      });
    } catch (err: any) {
      return reply.code(404).send({
        success: false,
        message: err.message,
      });
    }
  },

  /** ---------------- LIST ACCOUNTS ---------------- */
  async listAccounts(request: FastifyRequest, reply: FastifyReply) {
    const ctx = request.ctx as DB_RequestContext;

    try {
      const accounts = await AccountService.listAccounts(ctx);

      return reply.send({
        success: true,
        data: accounts,
      });
    } catch (err: any) {
      return reply.code(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  /** ---------------- DELETE ACCOUNT ---------------- */
  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const ctx = request.ctx as DB_RequestContext;
    const { accountId } = request.params as any;

    try {
      await AccountService.deleteAccount(accountId, ctx);

      return reply.send({
        success: true,
        message: "Account deleted",
      });
    } catch (err: any) {
      return reply.code(400).send({
        success: false,
        message: err.message,
      });
    }
  },
};
