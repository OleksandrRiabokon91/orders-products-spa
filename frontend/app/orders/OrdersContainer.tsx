"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getOrders, removeOrder } from "@/redux/slices/ordersSlice";
import {
  openOrderDetails,
  closeOrderDetails,
} from "@/redux/slices/ordersUiSlice";

import OrdersList from "@/components/OrdersList/OrdersList";
import OrderDetails from "@/components/OrderDetails/OrderDetails";
import { OrdersRes } from "@/lib/api";

interface Props {
  initialOrders: OrdersRes[];
}

export default function OrdersContainer({ initialOrders }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const orders = useSelector((s: RootState) => s.orders.items);
  const activeOrderId = useSelector((s: RootState) => s.ordersUi.activeOrderId);

  useEffect(() => {
    dispatch(getOrders.fulfilled(initialOrders, "", undefined));
  }, [dispatch, initialOrders]);

  return (
    <div style={{ display: "flex" }}>
      <OrdersList
        orders={orders}
        activeOrderId={activeOrderId}
        onDelete={(id) => dispatch(removeOrder(id))}
        onOpenDetails={(id) => dispatch(openOrderDetails(id))}
      />

      {activeOrderId && (
        <OrderDetails
          orderId={activeOrderId}
          onClose={() => dispatch(closeOrderDetails())}
        />
      )}
    </div>
  );
}
