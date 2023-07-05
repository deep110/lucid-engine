import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/lucid.ts',
	output: [
		{
			format: 'umd',
			name: 'LUCID',
			file: 'build/lucid.js'
		},
		{
			format: 'es',
			file: 'build/lucid.module.js'
		}
	],
	plugins: [typescript()]
};
