import { TypeFormMapKey } from "../const";
import { FormConfig } from "../types";
import { PartnershipFormConfig } from "./PartnershipFormConfig";

const FORM_MAP: Partial<Record<TypeFormMapKey, FormConfig>> = {
  partnership: PartnershipFormConfig,
};

export const getFormConfig = (key: TypeFormMapKey) => {
  return FORM_MAP[key];
};
