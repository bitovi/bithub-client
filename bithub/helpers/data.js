steal(
	'vendor/lodash',
	function () {

		var existy = function(x) { return x!==null && x!==undefined };
		var isStringNully = function(x) { return x===null || x===undefined };
				
		var cleanup = function( data ) {
			_.each(_.keys(data), function(key) {
				if (isStringNully(data[key])) data[key] = '';
			});

			return data;			
		}
		
		return {
			cleanup: cleanup
		}
	}
);
