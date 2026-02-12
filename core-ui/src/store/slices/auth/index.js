import { createSlice } from "@reduxjs/toolkit";
import { _login } from "./login";
import { _logout } from "./logout";
import { REK, SLK, STK } from "#constants";

const initialState = {
  [STK.AUTH_KEY.USER]: null,
};

const _authSlice = createSlice({
  name: SLK.AUTH,
  initialState,
  reducers: {
    [REK.AUTH_KEY.LOGIN]: _login,
    [REK.AUTH_KEY.LOGOUT]: _logout,
  },
});

export const authSlice = {
  ..._authSlice.actions,
  reducer: _authSlice.reducer,
};
