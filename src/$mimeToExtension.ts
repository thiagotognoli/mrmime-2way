const mimes = {};

function mimeToExtensionLookup(mime) {
	return mimes[("" + mime).trim().toLowerCase()];
}
