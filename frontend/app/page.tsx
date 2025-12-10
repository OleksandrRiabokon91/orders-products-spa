"use client";
// import Image from "next/image";
// import styles from "./page.module.css";
import { io, Socket } from "socket.io-client";

import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
      process.env.NEXT_PUBLIC_API_URL
    );

    socket.on("sessions", (value: number) => {
      setCount(value);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <p>socket counter: {count}</p>;
}
