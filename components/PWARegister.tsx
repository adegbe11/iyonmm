"use client";
import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // A production worker left on localhost can serve stale development chunks.
      if ("serviceWorker" in navigator) {
        void navigator.serviceWorker.getRegistrations().then(registrations =>
          Promise.all(registrations.filter(registration => {
            const worker = registration.active || registration.waiting || registration.installing;
            return worker && new URL(worker.scriptURL).pathname === "/sw.js";
          }).map(registration => registration.unregister()))
        ).catch(() => {});
      }
      if ("caches" in window) {
        void caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("iyonm-")).map(key => caches.delete(key)))).catch(() => {});
      }
      return;
    }
    if ("serviceWorker" in navigator) {
      // Register after load so it never delays first paint.
      const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
    }
  }, []);
  return null;
}
