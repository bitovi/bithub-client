steal(
	'can',
	'bithub/lib/paginator.js',
	'can/route',
	'can/observe/delegate',
	'vendor/moment',
	'vendor/jstz',
	function(can, Paginator) {

		// determine client IANA tz key, eg. Europe/Zagreb
		var tz = jstz.determine().name();

		// default state, shouldn't be altered at any point
		var defaultState = {
			homepage: {
				latest: {
					order: 'thread_updated_at:desc',
					thread_updated_date: moment().format('YYYY-MM-DD'),
					exclude: 'source_data',
					offset: 0,
					limit: 1000
				},
				greatest: {
					order: 'upvotes:desc',
					exclude: 'source_data',
					offset: 0,
					limit: 25
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

		var filters = function() {
			var params = {};
			
			if (can.route.attr('project') !== 'all') params.tag = can.route.attr('project');
			if (can.route.attr('category') !== 'all') params.category = can.route.attr('category');
			if (can.route.attr('timespan') !== 'all') params.thread_updated_date = dateSpan(can.route.attr('timespan'));
			if (can.route.attr('state') !== 'both') params.state = can.route.attr('state');

			return params;
		}

		var iterLatest = function() {
			this.state.attr('homepage.latest.thread_updated_date', this.paginator.next());
		}

		var iterGreatest = function() {
			var greatest = this.state.homepage.greatest;
			this.state.attr('homepage.greatest.offset', greatest.offset + greatest.limit);
		}

		var currentPath = function() {
			return [can.route.attr('page'), can.route.attr('view')].join('.');
		}

		
		/*
		 * PROTOTYPE FUNCTIONS
		 */

		// resets query tracker state
		var resetState = function( cb ) {
			var self = this;

			if( !this.pending ) {
				this.pending = true;
				
				if (can.route.attr('view') == 'latest') {
					this.paginator.reset(function() {
						self.state.attr( defaultState );
						self.state.attr('homepage.latest.thread_updated_date', self.paginator.current());
						cb && cb();
						self.pending = false;
					});
				} else {
					self.state.attr( defaultState );
					self.state.attr('homepage.latest.thread_updated_date', self.paginator.current());
					cb && cb();
					self.pending = false;
				}
			}
			
		};

		// calculates query params
		var currentParams = function( params ) {

			// determine current page/view combo
			var currentPage = can.route.attr('page') || 'homepage',
				currentView = can.route.attr('view') || 'latest',
				cq = this.state[currentPage][currentView];

			// build and return query
			return can.extend({}, (cq ? cq.attr() : {}), filters() || {},  params || {});
		}

		// 
		var next = function() {
			if( can.route.attr('view') == 'latest' ) {
				iterLatest.call(this);
			} else if( can.route.attr('view') == 'greatest' ) {
				iterGreatest.call(this);
			}

			return currentParams.call(this);
		}

		
		/*
		 * CONSTRUCTOR
		 */

		return can.Construct.extend({
			
			init: function( opts, cb ) {
				var self = this;
				this.state = new can.Observe( defaultState );
				this.paginator = new Paginator( function() {
					self.state.attr('homepage.latest.thread_updated_date', self.paginator.current());
					cb && cb();
				});
			},

			reset:   resetState,
			current: currentParams,
			next:    next			
		});

	});
