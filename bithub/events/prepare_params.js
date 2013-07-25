steal(
	'can',
	'can/route',
	'vendor/moment',
	function(can) {
		
		var latestTimespan = new can.Observe({ endDate: moment(), startDate: moment().subtract('days', 1) }),  
			latestDateFilter = can.compute(function () {
				return latestTimespan.attr('startDate').format('YYYY-MM-DD') + ':' + latestTimespan.attr('endDate').format('YYYY-MM-DD');
			}),
			
			// lookup dict with default query params for loading events
			views = {
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
				})
			},

			decrementLatestDate = function() {
				latestTimespan.attr({
					endDate: latestTimespan.attr('endDate').subtract('days', 2),
					startDate: latestTimespan.attr('startDate').subtract('days', 2)
				});
			},
			
			resetFilter = function() {
				latestTimespan.attr({
					endDate: moment(),
					startDate: moment().subtract('days', 1)
				});
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

				return query;
			};

		return {
			views: views,
			prepareParams: prepareParams,
			resetFilter: resetFilter,
			decrementLatestDate: decrementLatestDate
		}
		
	});

