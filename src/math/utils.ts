export const MathUtil = {
	abs: Math.abs,
	sqrt: Math.sqrt,
	floor: Math.floor,
	cos: Math.cos,
	sin: Math.sin,
	acos: Math.acos,
	asin: Math.asin,
	atan2: Math.atan2,
	round: Math.round,
	pow: Math.pow,
	max: Math.max,
	min: Math.min,
	random: Math.random,

	degtorad: 0.017453292519943,
	radtodeg: 57.295779513082320876,
	PI: 3.141592653589793,
	TwoPI: 6.283185307179586,
	PI90: 1.570796326794896,
	PI270: 4.712388980384689,

	INF: Infinity,
	EPZ: 0.00001,
	EPZ2: 0.000001,

	generateUUID: function () {
		// http://www.broofa.com/Tools/Math.uuid.htm
		const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		const uuid = new Array(36);
		let rnd = 0, r;

		return function generateUUID() {
			for (let i = 0; i < 36; i++) {
				if (i === 8 || i === 13 || i === 18 || i === 23) {
					uuid[i] = '-';
				} else if (i === 14) {
					uuid[i] = '4';
				} else {
					if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
				}
			}

			return uuid.join("");
		};
	}(),
};
