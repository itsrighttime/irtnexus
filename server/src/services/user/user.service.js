import { userQuery } from "#queries";

import {
  otpManager,
  otpMeta,
  reservationManager,
} from "../redis/redis.instance.js";
import { translate } from "#translations";
import {
  generateBinaryUUID,
  HTTP_STATUS,
  RESPONSE,
  sendOtpEmail,
  executeAction,
  logger,
  bufferToUUID,
} from "#utils";
import { ACTION } from "#config";

const {
  createUser,
  createUserEmail,
  createUserName,
  getUserByEmail,
  getUserByUsername,
  getDbOpUser,
} = userQuery;

export const registerUserStep1 = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.REGISTER_SEND_OTP, type: ACTION.TYPE.AUTH },
    resource: { type: "USER", id: payload.email },
    handler: async () => {
      const { fname, mname, lname, email, username } = payload;
      logger.debug("registerUserStep1 called", {
        email,
        username,
        fname,
        mname,
        lname,
      });

      const existingEmail = await getUserByEmail(email);
      logger.debug("Checked existing email", {
        email,
        exists: !!existingEmail,
      });
      if (existingEmail) {
        logger.warn("Email already exists", { email });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_CONFLICT,
          translate("user.already_exists", { name: "Email" }),
          "00010",
        );
      }

      const existingUsername = await getUserByUsername(username);
      logger.debug("Checked existing username", {
        username,
        exists: !!existingUsername,
      });
      if (existingUsername) {
        logger.warn("Username already exists", { username });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_CONFLICT,
          translate("user.already_exists", { name: "Username" }),
          "00011",
        );
      }

      const reservation = await reservationManager.reserve({
        email,
        username,
      });
      logger.debug("Reservation attempt result", {
        email,
        username,
      });

      if (!reservation.success) {
        logger.warn("Reservation failed", { email, username });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_CONFLICT,
          translate("user.identifier_unavailable"),
          "00012",
        );
      }

      const otpResult = await otpManager.create(email, {
        scope: "register",
        reservationToken: reservation.token,
      });
      logger.debug("OTP creation result", { email, otpResult });

      if (!otpResult.success) {
        logger.warn("Email cooldown period active", { email, username });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x2_ALREADY_REPORTED,
          translate("email.cooldown"),
          "00013",
        );
      }

      await sendOtpEmail(email, `${fname} ${lname}`, otpResult.otp);
      logger.info("OTP sent successfully", {
        email,
      });

      return RESPONSE.struct(
        RESPONSE.status.SUCCESS,
        HTTP_STATUS.x2_OK,
        translate("user.sent_mail_otp"),
        "00014",
        {
          reservationToken: reservation.token,
          expiresIn: otpMeta.ttl,
        },
      );
    },
  });

/**
 * Step 2: Verify OTP & create user
 */
/**
 * Step 2: Verify OTP & create user
 */
export const registerUserStep2 = async (req, payload) =>
  executeAction({
    req,
    action: { name: ACTION.NAME.REGISTER_VERIFY_OTP, type: ACTION.TYPE.AUTH },
    resource: { type: "USER", id: payload.email },
    handler: async () => {
      const { fname, mname, lname, email, otp, reservationToken } = payload;
      logger.debug("registerUserStep2 called", {
        email,
        fname,
        mname,
        lname,
      });

      const reservation = await reservationManager.get(reservationToken);
      logger.debug("Fetched reservation", { reservation });

      if (!reservation || reservation.email !== email) {
        logger.debug("Reservation expired or mismatch", {
          email,
          reservationEmail: reservation?.email,
        });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_GONE,
          translate("user.reservation_expired"),
          "00015",
        );
      }

      const otpResult = await otpManager.verify(email, otp);
      logger.debug("OTP verification result", { email, otpResult });

      if (!otpResult.success) {
        logger.warn("OTP verification failed", { email, type: otpResult.type });
        if (otpResult.type === 1) {
          logger.warn("User OTP blocked due to too many attempts", { email });
          return RESPONSE.struct(
            RESPONSE.status.ERROR,
            HTTP_STATUS.x4_LOCKED,
            translate("user.otp_too_many_attempts"),
            "00016",
          );
        }

        logger.warn("User provided invalid OTP", { email });
        return RESPONSE.struct(
          RESPONSE.status.ERROR,
          HTTP_STATUS.x4_BAD_REQUEST,
          translate("user.invalid_otp"),
          "00017",
        );
      }

      try {
        const userDb = getDbOpUser();
        logger.debug("Starting DB transaction to create user", { email });

        await userDb.transaction(async (conn) => {
          const userId = generateBinaryUUID();
          logger.debug("Generated userId");

          await createUser({ userId, username: reservation.username }, conn);
          logger.info("User created in DB", {
            username: reservation.username,
          });

          const fullName = [fname, mname, lname].filter(Boolean).join(" ");
          if (fullName) {
            await createUserName(
              {
                nameId: generateBinaryUUID(),
                userId,
                fullName,
                nameType: "preferred",
              },
              conn,
            );
            logger.info("User full name saved", { fullName });
          }

          await createUserEmail(
            {
              emailId: generateBinaryUUID(),
              userId,
              email,
              isPrimary: true,
              isVerify: true,
            },
            conn,
          );
          logger.info("User email saved and verified", { email });
        });

        await reservationManager.consume(reservationToken);
        logger.info("Reservation token consumed", { reservationToken });

        return RESPONSE.struct(
          RESPONSE.status.SUCCESS,
          HTTP_STATUS.x2_CREATED,
          translate("user.created"),
          "00018",
        );
      } catch (err) {
        logger.error(`Error creating user via ${email}`);
        logger.error(err);
        if (err?.errno === 1062) {
          logger.warn("User already exists", { email });
          return RESPONSE.struct(
            RESPONSE.status.ERROR,
            HTTP_STATUS.x4_CONFLICT,
            translate("user.already_exists"),
            "00019",
          );
        }
        throw err;
      }
    },
  });
