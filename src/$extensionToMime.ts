const mimes = {};

function extensionToMimeLookup(extn) {
	let extnNormalized = ("" + extn).trim().toLowerCase();
	let extensionIdx = extnNormalized.lastIndexOf(".");
	return mimes[
		!~extensionIdx ? extnNormalized : extnNormalized.substring(++extensionIdx)
	];
}
