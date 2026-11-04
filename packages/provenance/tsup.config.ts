import type { Options } from 'tsup';
import pkg from './package.json';

export const tsup: Options = {
	dts: true,
	entry: [
		'src/index.ts',
		'src/providers/index.ts',
		'src/initiatives/index.ts',
		'src/vite/index.ts',
		'src/helpers/index.ts'
	],
	external: ['svelte', '@sveltejs/kit'],
	format: ['esm'],
	legacyOutput: false,
	sourcemap: true,
	// The entry points share one chunk of common code. Without this, each entry point holds
	// its own copy of each class, and an instanceof check across entry points fails.
	splitting: true,
	bundle: true,
	clean: true,
	define: {
		PACKAGE_NAME: JSON.stringify(pkg.name),
		PACKAGE_VERSION: JSON.stringify(pkg.version)
	}
};
