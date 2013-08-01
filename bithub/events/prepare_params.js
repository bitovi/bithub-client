steal(
	'can',
	'can/route',
	'vendor/moment',
	function(can) {

		// lookup dict with default query params for loading events
		var views = {
				latest: new can.Observe({
					order: ['thread_updated_date:desc', 'categories:asc', 'thread_updated_at:desc'],
					exclude: 'source_data',
					offset: 0,
					limit: 25
				}),
				greatest: new can.Observe({
					order: 'upvotes:desc',
					//order: ['upvotes:desc', 'thread_updated_at:desc'],
					exclude: 'source_data',
					offset: 0,
					limit: 25
				})
			},

			timespanFilter = function( timespan ) {						
				var	format = 'YYYY-MM-DD';
				
				var timespans = {
					day: moment.utc().format(format),
					week: moment.utc().subtract('days', 7).format(format) + ":" + moment.utc().format(format),
					month: moment.utc().subtract('months', 1).format(format) + ":" + moment.utc().format(format)
				}

				return timespans[timespan];
			},
			
			resetFilter = function() {
				views.latest.attr('offset', 0);
				views.greatest.attr('offset', 0);
			},
			
			prepareParams =  function( params ) {
				
				// determine view
				var view = views[can.route.attr('view')];

				// build query
				var query = can.extend({}, view.attr(), params || {});

				// append filters
				if (can.route.attr('project') !== 'all') query.tag = can.route.attr('project');
				if (can.route.attr('category') !== 'all') query.category = can.route.attr('category');
				if (can.route.attr('timespan') !== 'all') query.thread_updated_date = timespanFilter(can.route.attr('timespan'));

				return query;
			};

		return {
			views: views,
			prepareParams: prepareParams,
			resetFilter: resetFilter
		}
		
	});

