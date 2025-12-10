"use client";

import { useDispatch } from "react-redux";
import { selectOrder, openDeleteModal } from "@/redux/slices/uiSlice";

export default function OrdersList({ orders }) {
  const dispatch = useDispatch();

  return (
    <div className="orders-list">
      <h2>Orders</h2>

      {orders.map((o) => (
        <div key={o.id} className="order-card">
          <div
            className="order-card__title"
            onClick={() => dispatch(selectOrder(o.id))}
          >
            {o.title}
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => dispatch(openDeleteModal())}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
