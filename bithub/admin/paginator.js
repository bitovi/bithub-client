steal(
	'can/map',
	function(Observe) {

		var parse10 = function(val) { return parseInt(val, 10) },
			existy = function(val) { return (val != null && val != undefined) },
			defaults = { limit: 20, offset: 0 };

		function Paginator (initialState) {
			if (existy(initialState)) {

				// assume we were supplied with all props
				if (_.isObject(initialState) && !_.isEmpty(initialState)) {
					this.state = new Observe({
						offset: _.isNumber(initialState.offset) ? initialState.offset : parse10(initialState.offset),
						limit: _.isNumber(initialState.limit) ? initialState.limit : parse10(initialState.limit)
					});
					
				// assume we were supplied only with 'offset'
				} else if (_.isNumber(initialState) || _.isString(initialState)) {
					this.state = new Observe(_.merge(defaults, { offset: _.isNumber(initialState) ? initialState : parse10(initialState) }));
				}

			// empty args list
			} else {
				this.state = new Observe(defaults);
			}
		}

		Paginator.prototype = {
			limit        : function () { return this.state.attr('limit') },
			offset       : function () { return this.state.attr('offset') },
			currentState : function () { return this.state.attr() },
			prevOffset   : function () { var diff = this.state.attr('offset') - this.state.attr('limit'); return (diff >= 0 ? diff : 0) },
			nextOffset   : function () { return this.state.attr('offset') + this.state.attr('limit') },
			updateOffset : function (newVal) {
				if (existy(newVal) && _.isString(newVal))
					this.state.attr('offset', parse10(newVal));
				else
					this.state.attr('offset', defaults.offset);
			}

		}

		return Paginator;
	}
);
