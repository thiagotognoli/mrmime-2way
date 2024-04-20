// @ts-check
/// <reference types="node" />
import { join, dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import DB from "mime-db";

const ROOT = resolve(".");

const input = join(ROOT, "src/$mimeToExtension.ts");
const denomod = join(ROOT, "deno/mimeToExtension.ts");

function write(file: string, data: string) {
	let f = resolve(ROOT, file);
	fs.writeFileSync(f, data);
	console.log('~> "%s" created', file);
}

// experimental/vendors
let IGNORE = /[/](x-|vnd\.)/;
let raw: Record<string, string> = {};

let mtype: string, arr: string[];

for (mtype in DB) {
	if (IGNORE.test(mtype)) continue;

	arr = DB[mtype].extensions || [];
	if (!arr.length) continue;
	raw[mtype] = arr[0];
}

let mimes: Record<string, string> = {};
Object.keys(raw)
	.sort()
	.forEach((x) => {
		mimes[x] = raw[x];
	});

let content =
	fs.readFileSync(input, "utf8").replace("{}", JSON.stringify(mimes, null, 2)) +
	"\n";

let esm = content + "export { mimes, mimeToExtensionLookup };\n";
let cjs =
	content +
	"exports.mimes = mimes;\nexports.mimeToExtensionLookup = mimeToExtensionLookup;\n";

// build exports
write("mimeToExtension.mjs", esm);
write("mimeToExtension.js", cjs);

let denodir = dirname(denomod);
fs.existsSync(denodir) || fs.mkdirSync(denodir);

fs.copyFileSync("mimeToExtension.md", join(denodir, "mimeToExtension.md"));
console.log('\n~> "deno/mimeToExtension.md" created');

write(
	"deno/mimeToExtension.ts",
	esm
		.replace(
			"function mimeToExtensionLookup(mime) {",
			"function mimeToExtensionLookup(mime: string): string | undefined {"
		)
		.replace("const mimes = {", "const mimes: Record<string, string> = {")
);

if (!process.env.CI) {
	try {
		spawnSync("deno", ["fmt", denomod], { cwd: ROOT });
		console.log('\n~> $ deno fmt "deno/mimeToExtension.ts"');
	} catch (err) {
		console.log("[deno]", err.stack);
	}
}

fs.copyFileSync(denomod, "src/mimeToExtension.ts");
console.log('\n~> "src/mimeToExtension.ts" created');
