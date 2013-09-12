steal(
	'can',
	'can/route',
	'vendor/moment',
	function(can) {

		var queryTracker = {
			homepage: {
				latest: new can.Observe({
					order: ['thread_updated_date:desc', 'categories:asc', 'thread_updated_at:desc'],
					exclude: 'source_data',
					offset: 0,
					limit: 25
				}),
				greatest: new can.Observe({
					order: 'upvotes:desc',
					exclude: 'source_data',
					offset: 0,
					limit: 25
				}),
				details: new can.Observe({}),
				rewards: new can.Observe({})
			},
			profile: {
				info: new can.Observe(),
				activities: new can.Observe()
			},
			admin: {
				users: new can.Observe(),
				tags: new can.Observe(),
				rewards: new can.Observe()
			},
			earnpoints: {},
			rewards: {},
			eventdetails: {}
		},

		timespanFilter = function( timespan ) {						
			var	format = 'YYYY-MM-DD';

			if (can.route.attr('view') !== 'greatest')
				return undefined;

			var timespans = {
				day: moment.utc().format(format),
				week: moment.utc().subtract('days', 7).format(format) + ":" + moment.utc().format(format),
				month: moment.utc().subtract('months', 1).format(format) + ":" + moment.utc().format(format)
			}

			return timespans[timespan];
		},

		resetFilter = function() {
			queryTracker.homepage.latest.attr('offset', 0);
			queryTracker.homepage.greatest.attr('offset', 0);
		},

		prepareParams = function( params ) {

			// determine current page/view combo
			var currentPage = can.route.attr('page') || 'homepage',
				currentView = can.route.attr('view') || 'latest',
				cq = queryTracker[currentPage][currentView];

			// build query
			var query = can.extend({}, (cq ? cq.attr() : {}), params || {});

			// append filters
			if (can.route.attr('project') !== 'all') query.tag = can.route.attr('project');
			if (can.route.attr('category') !== 'all') query.category = can.route.attr('category');
			if (can.route.attr('timespan') !== 'all') query.thread_updated_date = timespanFilter(can.route.attr('timespan'));
			if (can.route.attr('state') !== 'both') query.state = can.route.attr('state');

			return query;
		};

		return {
			queryTracker: queryTracker,
			prepareParams: prepareParams,
			resetFilter: resetFilter
		}

	}
);
