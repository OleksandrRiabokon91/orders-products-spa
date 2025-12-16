"use client";
import css from "./TopMenu.module.css";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Link from "next/link";
import Image from "next/image";

export default function TopMenu() {
  const [count, setCount] = useState(0);

  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeoutId = setTimeout(() => {
      setDateTime(new Date());
    }, 0);

    const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
      process.env.NEXT_PUBLIC_API_URL
    );

    socket.on("sessions", (value: number) => {
      setCount(value);
    });

    const timerId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      socket.disconnect();
      clearInterval(timerId);
    };
  }, []);
  if (!dateTime) return null;

  const formattedDate = dateTime.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        <Image
          src="/logo.png"
          alt="Inventory"
          width={80}
          height={80}
          priority
        />
        <span className={css.logo_text}>INVENTORY</span>
      </Link>

      <ul className={css.datetime}>
        <li>
          <svg width="16" height="16" className={css.icon} aria-hidden>
            <use href="/sprite.svg#icon-calendar" />
          </svg>
          {formattedDate}
        </li>

        <li>
          <svg width="16" height="16" className={css.icon} aria-hidden>
            <use href="/sprite.svg#icon-clock" />
          </svg>
          {formattedTime}
        </li>

        <li>
          <svg width="16" height="16" className={css.icon} aria-hidden>
            <use href="/sprite.svg#icon-users" />
          </svg>
          {count}
        </li>
      </ul>
    </header>
  );
}
