steal(
	'jquery',
	function () {

		var groupByIter = function (result, keys, value) {
			// pop out first (destructive!)
			var key = keys.splice(0,1);

			// do nesting and finally push object
			if (key.length > 0) {

				// find or create nesting object
				if (result.filter(function (item) { if (item.key == value[key]) return item; }).length == 0) {
					result.push({key: value[key], value: []});
				}

				// do iter
				groupByIter(result[result.length-1].value, keys, value);
				
			} else {
				result.push(value);
			};
		};

		// static method on jQuery object
		$.groupBy = function (collection, keys) {
			var result = [];
			collection.attr('length');
			
			$.each(collection, function (i, value) {

				// if value is string wrap it inside array
				if (typeof keys === "string") { keys = [keys]; }
				
				// call recursion passing copy of the keys
				groupByIter(result, keys.slice(0), value);
				
			});
			return result;		
		};
	});


/* KEEP FOR NOW 
steal(
	'jquery',
	function () {

		var groupByIter = function (result, keys, value) {
			var key = keys.splice(0,1);

			if (keys.length > 0) {

				// if key doesn't exits create a new key/object pair 
				if (!result[value[key]]) { result[value[key]] = {};	}

				// do iter
				groupByIter(result[value[key]], keys, value);
				
			} else {
				
				// if key/array exists push value to it or create key/array pair.
				if (result[value[key]]) {
					result[value[key]].push(value);
				} else {
					result[value[key]] = [value];
				}
			}
		};

		// static method on jQuery object
		$.groupBy = function (collection, keys) {
			var result = {};
 			collection.attr('length');

			$.each(collection, function (i, value) {

				// if value is string wrap it inside array
				if (typeof keys === "string") { keys = [keys]; }
				
				// call recursion passoing copy of keys
				groupByIter(result, keys.slice(0), value);
				
			});
			return result;		
		};
	});
*/
