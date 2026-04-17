"use client";

import { makeUrl } from "../../helper/urlFormatter.js";
import { workspaceLayoutKeys } from "../../helper/workspaceLayoutKeys.js";
import {
  ScreenType,
  type ScreenTypeValue,
} from "../../const";
// import { apiCaller } from "../../utils/apiCaller.js";

const { LEVELS, ZONES, POSITIONS } = workspaceLayoutKeys;

type Credentials = Record<string, unknown>; // replace with real shape if known

type SetUserDetails = (value: {
  user: {
    userId: string;
    name: string;
    role: string;
    screenType: ScreenTypeValue;
  };
}) => void;

type Navigate = (url: string) => void;

type LoginParams = {
  setUserDetails: SetUserDetails;
  credentials: Credentials;
  navigate: Navigate;
  workspace: string;
};

export const login = async ({
  setUserDetails,
  credentials,
  navigate,
  workspace,
}: LoginParams): Promise<void> => {
  const successCodes = ["CGP0046"];

  // const response = await apiCaller({
  //   endpoint: "/api/login",
  //   method: "POST",
  //   body: credentials,
  // });

  setUserDetails({
    user: {
      userId: "H59SW8E",
      name: "Danishan Farookh",
      role: "OWNER",
      screenType: ScreenType.FULL_SCREEN,
    },
  });

  navigate(
    makeUrl(
      {
        level: LEVELS.primary,
        zone: ZONES.commandBar,
        position: POSITIONS.start,
        workspaceId: workspace,
        key: workspace,
      },
      true,
    ),
  );
};
