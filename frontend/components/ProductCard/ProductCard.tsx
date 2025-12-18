import { ProductRes } from "@/lib/api";
import css from "./ProductCard.module.css";
//! компонент пока сырой
interface Props {
  product: ProductRes;
  onDelete?: (id: number) => void; //! optional, для удаления - пока не доделан
}

export default function ProductCard({ product, onDelete }: Props) {
  return (
    <li className={css.card_box} data-product-id={product.id}>
      <h4>{product.title}</h4>
      <div>
        <span>Price:</span>
        <strong>{product.price[1].value} USD</strong>
      </div>
      {/* {product.tags?.length > 0 && (
        <div>
          <span>Tags:</span>
          {product.tags.join(", ")}
        </div>
      )} */}

      {onDelete && (
        <button
          type="button"
          aria-label="Удалить продукт"
          onClick={() => onDelete(product.id)}
        >
          <svg width="16" height="16" aria-hidden>
            <use href="/sprite.svg#icon-bin" />
          </svg>
        </button>
      )}
    </li>
  );
}
