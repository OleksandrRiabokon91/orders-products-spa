import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";
import ordersUiReducer from "./slices/ordersUiSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    ordersUi: ordersUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
