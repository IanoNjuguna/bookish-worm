/**
 * Utility to validate redirect URLs against an allowlist.
 * Prevents Open Redirect vulnerabilities by ensuring the URL is either
 * an internal path or belongs to an allowed domain.
 */

const ALLOWED_DOMAINS = [
	'doba.world',
	'localhost:3000',
	'localhost:3001',
];

/**
 * Validates if a redirect URL is safe to use.
 * @param url The URL to validate.
 * @returns boolean True if the URL is safe, false otherwise.
 */
export function isValidRedirect(url: string | null | undefined): boolean {
	if (!url) return false;

	// Allow internal paths (start with / and not //)
	if (url.startsWith('/') && !url.startsWith('//')) {
		return true;
	}

	try {
		const parsedUrl = new URL(url);
		const domain = parsedUrl.host;

		return ALLOWED_DOMAINS.includes(domain);
	} catch (e) {
		// If it's not a valid URL or path, it's unsafe
		return false;
	}
}

/**
 * Returns a safe redirect URL, falling back to a default if the target is unsafe.
 * @param url The target redirect URL.
 * @param fallback The fallback URL if validation fails. Defaults to '/'.
 * @returns string The validated URL or the fallback.
 */
export function getSafeRedirect(url: string | null | undefined, fallback: string = '/'): string {
	if (isValidRedirect(url)) {
		return url as string;
	}
	return fallback;
}
