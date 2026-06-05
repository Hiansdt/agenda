"use client";

import { useEffect, useRef } from "react";

import { useUserController } from "@/user/adapters/inbound/controllers/UserController";

export function AuthHydrator() {
  const { restoreSession } = useUserController();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) {
      return;
    }

    hasHydrated.current = true;
    void restoreSession();
  }, [restoreSession]);

  return null;
}
