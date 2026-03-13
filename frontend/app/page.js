"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  return null;
}
