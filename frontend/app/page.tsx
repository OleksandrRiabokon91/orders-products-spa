// import Link from "next/link";
import css from "./page.module.css";

export default function Home() {
  return (
    <div className={css.container}>
      <h1>Добро пожаловать!</h1>
      <p>Выберите раздел слева, чтобы начать работу.</p>
    </div>
  );
}
