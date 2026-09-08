/**
 * Centralized Logger for Doba
 * Standardizes logging across frontend and backend.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const logger = {
	info: (message: string, ...data: any[]) => {
		if (!IS_PRODUCTION) {
			console.info(`[INFO] ${message}`, ...data);
		}
	},

	warn: (message: string, ...data: any[]) => {
		console.warn(`[WARN] ${message}`, ...data);
	},

	error: (message: string, ...data: any[]) => {
		// In production, this could be extended to send to Sentry/LogRocket/etc.
		console.error(`[ERROR] ${message}`, ...data);
	},

	debug: (message: string, ...data: any[]) => {
		if (!IS_PRODUCTION) {
			console.debug(`[DEBUG] ${message}`, ...data);
		}
	}
};

export default logger;
