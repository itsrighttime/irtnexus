import { authSlice } from "./slices";
import { SLK } from "#constants";

export const StoreReducer = {
  [SLK.AUTH]: authSlice.reducer,
};
