"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./NavigationMenu.module.css";
import Image from "next/image";

export default function NavigationMenu() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href && pathname !== "/";

  return (
    <aside className={`${css.sidebar} ${open ? css.open : css.closed}`}>
      <button
        className={css.toggleButton}
        onClick={() => setOpen((v) => !v)}
        title={open ? "Скрыть сайдбар" : "Открыть сайдбар"}
        aria-label={open ? "Hide sidebar" : "Show sidebar"}
      >
        <svg width="16" height="16" aria-hidden className={css.icon}>
          {open ? (
            <use href="/sprite.svg#icon-circle-left" />
          ) : (
            <use href="/sprite.svg#icon-circle-right" />
          )}
        </svg>
      </button>
      <div className={css.content}>
        <div className={css.profile}>
          <Link
            href="/users/profile"
            className={css.avatarLink}
            aria-label="Перейти в профиль"
            title="Перейти в профиль"
          >
            <Image
              width={46}
              height={46}
              src="/avatar.jpg" /* заглушка */
              alt="User avatar"
              className={css.avatar}
            />
          </Link>
          <Link
            href="/users/profile/set"
            className={css.profileSettings}
            aria-label="Настройки профиля"
            title="Настройки профиля"
          >
            <svg className={css.icon} width="12" height="12" aria-hidden>
              <use href="/sprite.svg#icon-set" />
            </svg>
          </Link>
        </div>
        <nav className={css.nav}>
          <ul className={css.list}>
            <li>
              <Link
                href="/orders"
                className={`${css.link} ${
                  isActive("/orders") ? css.active : ""
                }`}
              >
                Приходы
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`${css.link} ${
                  isActive("/products") ? css.active : ""
                }`}
              >
                Продукты
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className={`${css.link} ${
                  isActive("/users") ? css.active : ""
                }`}
              >
                Пользователи
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={`${css.link} ${
                  isActive("/settings") ? css.active : ""
                }`}
              >
                Настройки
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
