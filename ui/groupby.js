steal(
	'jquery',
	function () {
		(function () {

			// static method on jQuery object
			$.groupBy = function (collection, key) {
				var result = {};
				$.each(collection, function (index, value) {
					// create a new key:[value] pair or append to existing one
					if (!result[value[key]]) {
						result[value[key]] = [value];
					} else {
						result[value[key]].push(value);
					}
				});
				return result;		
			};
		})();
	});
