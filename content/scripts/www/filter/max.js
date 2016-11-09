var MULTI = 1000;
var DEC = 100;

module.exports =function () {
	return function (input, min) {
		var min = parseInt(min),
			out = parseInt(input) || 0,
			min = min != NaN ? min : 1;
		
		var more = '';
		if(out >= MULTI ){
			out = Math.round( (out / MULTI) * DEC) / DEC;
			more = 'K';
			if(out >= MULTI){
				out = Math.round( (out / MULTI) * DEC) / DEC;
				more = 'M';
			}
		} else {
			if(out <= min)
				out = '';

			if(out >= 99)
				out = '+99';
		}

		return out + more;
	};
};

module.exports.$inject = [];