"use client";

import React from "react";
import { CardanoContext } from "./cardanoContext";
import { useCardanoConnection } from "./useCardanoConnection";

export function CardanoProvider({ children }: { children: React.ReactNode }) {
	const value = useCardanoConnection();

	return (
		<CardanoContext.Provider value={value}>
			{children}
		</CardanoContext.Provider>
	);
}
