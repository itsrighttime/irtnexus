import { ScreenType, type ScreenTypeValue } from "../../tsx/WorkspaceLayoutWrapper";

type UserDetails = {
  user: {
    userId: string;
    name: string;
    role: string;
    screenType: ScreenTypeValue;
  };
};


type SetUserDetails = (value: UserDetails) => void;
type SetLoading = (value: boolean) => void;

export const checkSession = async (
  setUserDetails: SetUserDetails,
  setLoading: SetLoading,
): Promise<void> => {
  // const response = await apiCaller({
  //   endpoint: "/auth-api/checkSession",
  // });

  setUserDetails({
    user: {
      userId: "H59SW8E",
      name: "Danishan Farookh",
      role: "OWNER",
      screenType: ScreenType.FULL_SCREEN,
    },
  });

  setLoading(false);
};
