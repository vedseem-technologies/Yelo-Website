// components/auth/AuthGate.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import LoginModal_mail from "../LoginModal_mail";

export default function AuthGate() {
  const { backendUser, isLoginModalOpen, closeLoginModal } = useAuth();

  // If user is logged in and modal is closed, we don't need to render anything here
  if (backendUser && !isLoginModalOpen) return null;

  return (
    <LoginModal_mail
      isOpen={isLoginModalOpen}
      setIsOpen={closeLoginModal}
    />
  );
}



