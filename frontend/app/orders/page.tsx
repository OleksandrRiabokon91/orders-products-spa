// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/lib/axios";
// import OrdersList from "./OrdersList";
// import OrderDetails from "./OrderDetails";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export default function OrdersPage() {
//   const selectedOrderId = useSelector(
//     (state: RootState) => state.ui.selectedOrderId
//   );

//   const { data: orders = [] } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => (await api.get("/orders")).data,
//   });

//   return (
//     <div className="orders-layout container mt-4">
//       <div className="row">
//         <div className="col-6">
//           <OrdersList orders={orders} />
//         </div>

//         <div className="col-6">
//           {selectedOrderId && <OrderDetails id={selectedOrderId} />}
//         </div>
//       </div>
//     </div>
//   );
// }

//
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setOrders } from "@/store/ordersSlice";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const { data, isLoading } = useQuery(["orders"], fetchOrders);

  useEffect(() => {
    if (data?.data) {
      dispatch(setOrders(data.data));
    }
  }, [data, dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="orders">
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.title} - {order.productsCount} products - ${order.totalUSD}
          </li>
        ))}
      </ul>
    </div>
  );
}
