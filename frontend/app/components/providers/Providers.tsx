"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/config";
import { CardanoProvider } from "./CardanoProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<CardanoProvider>
				{children}
			</CardanoProvider>
		</QueryClientProvider>
	);
}
