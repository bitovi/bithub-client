steal(
	'jquery',
	function () {

		var groupIntoArrayIter = function (result, keys, value) {
			// pop out first (destructive!)
			var key = keys.splice(0,1);

			// do nesting and finally push object
			if (key.length > 0) {

				// find or create nesting object
				if (result.filter(function (item) { if (item.key == value[key]) return item; }).length == 0) {
					result.push({key: value[key], value: []});
				}

				// do iter
				groupIntoArrayIter(result[result.length-1].value, keys, value);
				
			} else {
				result.push(value);
			};
		};

		/*
		 * Groups array recursively by keys into nested arrays
		 *
		 * Input collection:
		 * [{foo: "bar", title: "first"},
		 *  {foo: "bar", title: "second"},
		 *  {foo: "baz", title: "third"}]
		 *
		 * Output grouped by 'foo':
		 * [{
		 *    key: "bar",
		 *    value: [{foo: "bar", title: "first"}, {foo: "bar", title: "second"}]
		 *  },{
		 *    key: "baz",
		 *    value: [{foo: "baz", title: "third"}]
		 * }]
		 *		 
		 */
		var groupIntoArray = function (collection, keys) {
			var result = [];
			
			$.each(collection, function (i, value) {

				// if value is string wrap it inside array
				if (typeof keys === "string") { keys = [keys]; }
				
				// call recursion passing copy of the keys
				groupIntoArrayIter(result, keys.slice(0), value);
				
			});
			return result;		
		};

		
		var groupIntoObjectIter = function (result, keys, value) {
			var key = keys.splice(0,1);

			if (keys.length > 0) {

				// if key doesn't exits create a new key/object pair 
				if (!result[value[key]]) { result[value[key]] = {};	}

				// do iter
				groupIntoObjectIter(result[value[key]], keys, value);
				
			} else {
				
				// if key/array exists push value to it or create key/array pair.
				if (result[value[key]]) {
					result[value[key]].push(value);
				} else {
					result[value[key]] = [value];
				}
			}
		};

		
		/*
		 * Groups array recursively by keys into object
		 *
		 * Input collection:
		 * [{foo: "bar", title: "first"},
		 *  {foo: "bar", title: "second"},
		 *  {foo: "baz", title: "third"}]
		 *
		 * Output grouped by 'foo':
		 * {
		 *   bar: [{foo: "bar", title: "first"}, {foo: "bar", title: "second"}],
		 *   baz: [{foo: "baz", title: "third"}]
		 * }
		 *		 
		 */
		var groupIntoObject = function (collection, keys) {
			var result = {};

			$.each(collection, function (i, value) {

				// if value is string wrap it inside array
				if (typeof keys === "string") { keys = [keys]; }
				
				// call recursion passoing copy of keys
				groupIntoObjectIter(result, keys.slice(0), value);
				
			});
			return result;		
		};

		return {
			groupIntoArray: groupIntoArray,
			groupIntoObject: groupIntoObject
		};
		
	});

