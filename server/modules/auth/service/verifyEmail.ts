import { repoAccountEmail, repoVerification } from "#modules/identity/index.js";
import { DB_RequestContext } from "#packages/database/index.js";
import { ServiceResponse } from "#types";
import { VERIFICATION_STATUS } from "../const";

export async function verifyEmail(
  token: string,
  ctx: DB_RequestContext,
): Promise<ServiceResponse<null>> {
  const verification = await repoVerification.findOne({ token }, ctx);

  if (!verification) {
    return {
      success: false,
      message: "Invalid or expired verification token.",
    };
  }

  if (
    verification.status !== VERIFICATION_STATUS.PENDING ||
    verification.expires_at < new Date()
  ) {
    return { success: false, message: "Token expired or already used." };
  }

  // Update email as verified
  await repoAccountEmail.update(
    verification.target_id,
    { verified_at: new Date() },
    ctx,
  );

  // Mark verification as completed
  await repoVerification.update(
    verification.verification_id,
    { status: VERIFICATION_STATUS.VERIFIED, verified_at: new Date() },
    ctx,
  );

  return { success: true, message: "Email verified successfully.", data: null };
}
