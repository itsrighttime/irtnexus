// import { apiCaller } from "../../utils/apiCaller.js";

type SetUserDetails = (value: null) => void;
type Navigate = (path: string) => void;

type LogoutParams = {
  setUserDetails: SetUserDetails;
  navigate: Navigate;
};

export const logout = async ({
  setUserDetails,
  navigate,
}: LogoutParams): Promise<void> => {
  // const response = await apiCaller({
  //   endpoint: "/auth-api/logout",
  // });

  setUserDetails(null); // Clear user data
  navigate("/login");
};
