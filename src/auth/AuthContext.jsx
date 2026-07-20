import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { appApi, STORAGE_KEYS, CANONICAL_ADMIN_EMAIL } from "@/api/appApi";

const AuthContext = createContext(null);

const normEmail = (email) => (email || "").trim().toLowerCase();

/** Session navigateur parfois obsolète si le rôle a été corrigé dans la liste des utilisateurs. */
function repairCanonicalAdminSession(user) {
  if (!user?.email) return user;
  if (normEmail(user.email) === normEmail(CANONICAL_ADMIN_EMAIL)) {
    const r = String(user.user_role ?? "")
      .trim()
      .toLowerCase();
    if (r !== "admin") {
      return { ...user, user_role: "admin" };
    }
  }
  return user;
}

/** Session démo chauffeur : lien fiche Driver si absent (anciennes sessions localStorage). */
function repairDriverDemoSession(user) {
  if (!user?.email) return user;
  if (
    normEmail(user.email) === normEmail("jean.dupont@transport.com") ||
    normEmail(user.email) === normEmail("viktor.rostov@fleet.demo")
  ) {
    const r = String(user.user_role ?? "")
      .trim()
      .toLowerCase();
    if (r === "driver" && !user.linked_driver_id) {
      return { ...user, linked_driver_id: "drv-001" };
    }
  }
  return user;
}

const readUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.sessionUser);
    const parsed = raw ? JSON.parse(raw) : null;
    return repairDriverDemoSession(repairCanonicalAdminSession(parsed));
  } catch (error) {
    console.error("Erreur lecture utilisateur:", error);
    return null;
  }
};

const writeUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEYS.sessionUser);
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(user));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUser());

  useEffect(() => {
    writeUser(user);
  }, [user]);

  const login = async (payload) => {
    const authenticated = await appApi.auth.login(payload);
    setUser(authenticated);
    return authenticated;
  };

  const logout = async () => {
    await appApi.auth.logout();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  }
  return context;
}

