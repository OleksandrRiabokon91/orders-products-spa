// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useSelector, useDispatch } from "react-redux";
// import { api } from "@/lib/axios";
// import { RootState } from "@/redux/store";
// import { setFilterType } from "@/redux/slices/productsSlice";

// export default function ProductsPage() {
//   const dispatch = useDispatch();
//   const filterType = useSelector((s: RootState) => s.products.filterType);

//   const { data: products = [] } = useQuery({
//     queryKey: ["products", filterType],
//     queryFn: async () =>
//       (await api.get("/products", { params: { type: filterType } })).data,
//   });

//   return (
//     <div className="container mt-4">
//       <h2>Products</h2>

//       <select
//         className="form-select w-25 mb-3"
//         onChange={(e) => dispatch(setFilterType(e.target.value))}
//         value={filterType || ""}
//       >
//         <option value="">All</option>
//         <option value="laptop">Laptop</option>
//         <option value="phone">Phone</option>
//       </select>

//       <div className="products-list">
//         {products.map((p) => (
//           <div key={p.id} className="product-card">
//             <p className="product-card__name">{p.name}</p>
//             <p className="product-card__type">{p.type}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setProducts } from "@/store/productsSlice";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const [filter, setFilter] = useState("");

  const { data, isLoading } = useQuery(["products", filter], () =>
    fetchProducts(filter)
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setProducts(data.data));
    }
  }, [data, dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="products">
      <h1>Products</h1>
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="">All</option>
        <option value="Monitors">Monitors</option>
        <option value="Keyboards">Keyboards</option>
        <option value="Laptops">Laptops</option>
        <option value="Mice">Mice</option>
      </select>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.title} ({p.type}) - ${p.price_usd} / ₴{p.price_uah} -{" "}
            {p.orderTitle}
          </li>
        ))}
      </ul>
    </div>
  );
}
