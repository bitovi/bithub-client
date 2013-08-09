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

			validator: function (message, fn) {
				var _f = function (/* args */) {
					return fn.apply(fn, arguments);
				};

				_f['message'] = message;
				return _f;
			},

			complement: function (fn) {
				return function() {
					return !pred.apply(null, _.toArray(arguments));
				}
			}
		}
	}
);
