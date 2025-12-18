// redux/slices/ordersUiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrdersUiState {
  activeOrderId: number | null;
}

const initialState: OrdersUiState = {
  activeOrderId: null,
};

const ordersUiSlice = createSlice({
  name: "ordersUi",
  initialState,
  reducers: {
    openOrderDetails(state, action: PayloadAction<number>) {
      state.activeOrderId = action.payload;
    },
    closeOrderDetails(state) {
      state.activeOrderId = null;
    },
  },
});

export const { openOrderDetails, closeOrderDetails } = ordersUiSlice.actions;

export default ordersUiSlice.reducer;
