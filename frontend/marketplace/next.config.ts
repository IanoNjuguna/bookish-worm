import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {},
	webpack: (config) => {
		config.experiments = {
			asyncWebAssembly: true,
			layers: true,
		};
		return config;
	},
};

export default nextConfig;
