"use client";

import { useContext } from "react";
import { CardanoContext } from "./cardanoContext";

export const useCardano = () => useContext(CardanoContext);
