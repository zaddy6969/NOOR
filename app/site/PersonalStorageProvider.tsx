"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { personalOwner, setPersonalOwner, STORAGE_ERROR_EVENT, ACCOUNT_CHANGE_EVENT } from "@/lib/personal-storage";
import { useNoorCopy } from "./SiteUtilities";

function subscribeOwner(callback: () => void) {
  window.addEventListener(ACCOUNT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(ACCOUNT_CHANGE_EVENT, callback);
}
const serverOwner = () => null;
function AccountStorage({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser();
  const nextOwner = isLoaded ? (user?.id ?? "guest") : null;
  const activeOwner = useSyncExternalStore(subscribeOwner, personalOwner, serverOwner);
  useLayoutEffect(() => {
    setPersonalOwner(nextOwner);
  }, [nextOwner]);
  // Unmount the previous account's reader/notes before mounting the new one.
  if (activeOwner === null || activeOwner !== nextOwner)
    return <p role="status" className="account-loading">Loading your private collection…</p>;
  return <div key={activeOwner} className="account-content">{children}</div>;
}
function StorageNotice() {
  const { t } = useNoorCopy();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const failed = () => setVisible(true);
    window.addEventListener(STORAGE_ERROR_EVENT, failed);
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, failed);
  }, []);
  return visible ? <aside className="storage-error-notice" role="alert"><span>{t("Your browser could not save this change. Free some storage or allow site storage, then try again.")}</span><button type="button" onClick={() => setVisible(false)} aria-label={t("Dismiss")}>×</button></aside> : null;
}
export default function PersonalStorageProvider({ configured, children }: { configured: boolean; children: React.ReactNode }) {
  return <><StorageNotice />{configured ? <AccountStorage>{children}</AccountStorage> : children}</>;
}
