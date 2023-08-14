"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d08c5134-5d8d-44e7-afc0-424cb3d8a457");
  }, []);

  return null;
};