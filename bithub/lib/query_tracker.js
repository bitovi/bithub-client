steal(
	'can',
	'bithub/lib/paginator.js',
	'can/route',
	'can/map/delegate',
	'vendor/moment',
	function(can, Paginator) {

		// default state, shouldn't be altered at any point
		var defaultState = {
			homepage: {
				latest: {
					order: 'thread_updated_ts:desc',
					thread_updated_date: moment().format('YYYY-MM-DD'),
					exclude: 'source_data',
					offset: 0,
					limit: 1000
				},
				greatest: {
					order: 'upvotes:desc',
					exclude: 'source_data',
					offset: 0,
					limit: 15
				},
				details: {},
				rewards: {}
			},
			profile: {
				info: {},
				activities: {}
			},
			admin: {
				users: {},
				tags: {},
				rewards: {}
			},
			earnpoints: {},
			rewards: {},
			eventdetails: {}
		};


		/*
		 * HELPER FUNCTIONS
		 */

		// traverses object by given path
		var traverseObject = function( obj, path ) {
			path = path.split('.');

			for( var i=0; i<path.length; i++ ) {
				if( obj[path[i]] == undefined ) {
					return undefined;
				} else  {
					obj = obj[path[i]];
				}
			}

			return obj;
		}

		// calculates day/week/month date spans
		var dateSpan = function( span ) {
			var	format = 'YYYY-MM-DD';

			var datespans = {
				day: moment().format(format),
				week: moment().subtract('days', 7).format(format) + ":" + moment().format(format),
				month: moment().subtract('months', 1).format(format) + ":" + moment().format(format)
			}

			return datespans[span];
		}

		var filteringClean = function(params){
			var attrs = ['tag', 'category', 'timespan', 'state'];
			for(var i = 0; i < attrs.length; i++){
				if(typeof params[attrs[i]] !== 'undefined'){
					return false;
				}
			}
			return true;
		}

		var filters = function() {
			var params = {};

			if(can.route.attr('project') !== 'all'){
				params.tag = can.route.attr('project');
			}
			if(can.route.attr('category') !== 'all'){
				params.category = can.route.attr('category');
			}
			if(can.route.attr('timespan') !== 'all' && can.route.attr('view') !== 'latest'){
				params.thread_updated_date = dateSpan(can.route.attr('timespan'))
			}
			if(can.route.attr('state') !== 'both'){
				params.state = can.route.attr('state');
			}

			if(filteringClean(params)){
				params.without_future = true;
			}

			if(params.category === 'event'){
				params.order = 'thread_updated_ts:asc';
			}

			return params;
		}

		var iterLatest = function() {
			if( !this.paginator.next() ){
				this._onEndOfList(true);
			}
		}

		var iterGreatest = function() {
			var greatest = this.state.homepage.greatest;
			this.state.attr('homepage.greatest.offset', greatest.offset + greatest.limit);
		}

		/*
		 * CONSTRUCTOR
		 */

		return can.Construct.extend({

			init: function( opts, cb ) {
				var self = this;

				defaultState.homepage.latest.thread_updated_date = function() {
					return self.paginator.current();
				};

				this.state = new can.Observe( defaultState );
				this.paginator = new Paginator(cb);

				this._onEndOfList = can.compute(false);
			},

			reset:   function( cb ) {
				var self = this;

				this._onEndOfList(false);

				if (can.route.attr('view') == 'latest') {
					if( !this._pending ) {
						this._pending = true;
						this.paginator.reset(function() {
							cb && cb();
							self._pending = false;
						});
					}
				} else {
					this.state.attr( defaultState );
					cb && cb();
				}
			},
			current: function( params ) {

				// determine current page/view combo
				var currentPage = can.route.attr('page') || 'homepage',
					currentView = can.route.attr('view') || 'latest',
					cq = this.state[currentPage][currentView],
					currentParams =  can.extend({}, (cq ? cq.attr() : {}), filters() || {},  params || {});

				// return query
				return currentParams;
			},
			next: function() {
				if( can.route.attr('view') == 'latest' ) {
					iterLatest.call(this);
				} else if( can.route.attr('view') == 'greatest' ) {
					iterGreatest.call(this);
				}

				return this.current()
			},
			hasNext : function(){
				return this.paginator.hasNext();
			}
		});

	});
