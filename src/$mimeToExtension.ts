const mimes = {};

function mimeToExtensionLookup(mime) {
	return mimes[("" + mime).trim().toLowerCase()];
}

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;

// export function mimeCharset(type) {
// 	if (!type || typeof type !== "string") return false;
// 	const match = EXTRACT_TYPE_REGEXP.exec(type);
// 	const mime = match && db[match[1].toLowerCase()];

// 	if (mime && mime.charset) return mime.charset;

// 	// default text/* to utf-8
// 	if (match && TEXT_TYPE_REGEXP.test(match[1])) return "UTF-8";

// 	return false;
// }
