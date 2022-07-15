export default {
	input: 'src/lucid.js',
	indent: '\t',
	output: [
		{
			format: 'umd',
			name: 'Lucid',
			file: 'build/lucid.js'
		},
		{
			format: 'es',
			file: 'build/lucid.module.js'
		}
	]
};