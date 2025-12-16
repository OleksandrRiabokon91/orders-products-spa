"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./NavigationMenu.module.css";

export default function NavigationMenu() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}
    >
      {/* Кнопка сворачивания */}
      <button
        className={styles.toggleButton}
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <span className={styles.toggleIcon} />
      </button>

      {/* Навигация */}
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link href="/orders" className={styles.link}>
              Приходы
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="/products" className={styles.link}>
              Продукты
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="/users" className={styles.link}>
              Пользователи
            </Link>
          </li>
          <li className={styles.item}>
            <Link href="/settings" className={styles.link}>
              Настройки
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
