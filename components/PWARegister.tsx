"use client";
import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register after load so it never delays first paint.
      const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
    }
  }, []);
  return null;
}
