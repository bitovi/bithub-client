steal(
	'vendor/lodash',
	function (_) {
		return {

			checker: function (/* validators */) {
				var validators = _.toArray(arguments);

				return function(obj) {
					return _.reduce(validators, function(errs, check) {
						if (check(obj)) return errs;
						else return _(errs).push(check.message).value();
					}, []);
				};
			},

			validator: function (message, fun) {
				var f = function (/* args */) {
					return fun.apply(fun, arguments);
				};

				f['message'] = message;
				return f;
			}
		}
	}
);
