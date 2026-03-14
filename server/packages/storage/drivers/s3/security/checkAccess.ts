export const checkAccess = async function (
  fileId: string,
  userId: string,
  action: string,
): Promise<boolean> {
  console.log("checkAccess called with", { fileId, userId, action });
  throw new Error("Need to Implement checkAccess");
};
