"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/documents");
  }, [router]);

  return (
    <div className={styles.container}>
      <p>Перенаправление на страницу документов...</p>
    </div>
  );
}
