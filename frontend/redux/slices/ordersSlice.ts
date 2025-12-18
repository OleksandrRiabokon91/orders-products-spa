import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrdersRes } from "@/lib/api";
import { fetchOrders, deleteOrder } from "@/lib/client_api";

export const getOrders = createAsyncThunk("orders/fetch", async () => {
  return await fetchOrders();
});

export const removeOrder = createAsyncThunk(
  "orders/delete",
  async (id: number) => {
    await deleteOrder(id);
    return id;
  }
);

interface OrdersState {
  items: OrdersRes[];
  loading: boolean;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export default ordersSlice.reducer;
