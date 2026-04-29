import { getFormConfig } from "../configs";
import { TypeFormMapKey } from "../const";

export const ssPartnershipConfig = async (key: TypeFormMapKey) => {
  return getFormConfig(key);
};
