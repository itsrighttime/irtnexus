import { TextInput } from "@/atoms";
import type { ComponentType } from "react";

import { FORM_FIELDS_TYPE as FFT } from "../validation/helper/fields";
export type ComponentRegistry = Record<string, ComponentType<any>>;

export const COMPONENT_REGISTRY: ComponentRegistry = {
  [FFT.TEXT]: TextInput,
  [FFT.PASSWORD]: TextInput,
  //   [FFT.DROPDOWN]: "",
  //   [FFT.MULTI_DROPDOWN]: "",
  //   [FFT.EMAIL]: "",
  //   [FFT.MOBILE]: "",
  //   [FFT.DATE]: "",
  //   [FFT.TIME]: "",
  //   [FFT.ADDRESS]: "",
  //   [FFT.TEXT_AREA]: "",
  //   [FFT.JSON]: "",
  //   [FFT.FILE]: "",
  //   [FFT.AUDIO]: "",
  //   [FFT.VIDEO]: "",
  //   [FFT.IMAGE]: "",
  //   [FFT.SECURITY_QUESTION]: "",
  //   [FFT.OTP]: "",
  //   [FFT.CHECKBOX]: "",
  //   [FFT.COLOR]: "",
  //   [FFT.RADIO]: "",
  //   [FFT.SEARCH]: "",
  //   [FFT.SWITCH]: "",
  //   [FFT.SLIDER]: "",
  //   [FFT.STEPPER]: "",
  //   [FFT.URL]: "",
  //   [FFT.GROUP]: "",
} as const;
