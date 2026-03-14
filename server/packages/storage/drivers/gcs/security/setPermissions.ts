export const setPermissions = async function (
  fileId: string,
  permissions: string[],
): Promise<void> {
  console.log("setPermissions called with", { fileId, permissions });
  throw new Error("Need to Implement setPermissions");
};
