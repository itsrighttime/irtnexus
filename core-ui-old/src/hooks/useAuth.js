import { REK, SLK, STK } from "#constants";
import { authSlice } from "#store/slices";
import { useSelector, useDispatch } from "react-redux";
export const useAuth = () => {
  const user = useSelector((state) => state[SLK.AUTH][STK.AUTH_KEY.USER]);
  const dispatch = useDispatch();

  return {
    [STK.AUTH_KEY.USER]: user,
    [REK.AUTH_KEY.LOGIN]: (username) =>
      dispatch(authSlice[REK.AUTH_KEY.LOGIN](username)),
    [REK.AUTH_KEY.LOGOUT]: () => dispatch(authSlice[REK.AUTH_KEY.LOGOUT]()),
  };
};
