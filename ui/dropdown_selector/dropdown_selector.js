steal(
	'can',
	'./init.ejs',
	'vendor/bootstrap',
	function(can, initView){

		var currentViewFiltered = function () {
			var currentPage = can.route.attr('page'),
				currentView = can.route.attr('view');

			if (currentPage === 'homepage' || currentPage === 'admin')
				return currentView;
			else
				return 'latest';
		};
				
		var dropdownItemRoute = function (item) {
			var routes = {
				project: item.name,
				category: can.route.attr('category'),
				timespan: can.route.attr('timespan') || 'week',
				view: currentViewFiltered()
			}

			if (can.route.attr('category') === 'bug') {
				routes.state = can.route.attr('state')
			}
			
			return can.route.url(routes, false);
		};

		return can.Control.extend({
			defaults : {
				defaultOption: {
					name: 'all',
					display_name: 'All projects'
				}
			}
		}, {
			init : function( el, opts ) {
				var self = this;
				self.element.html(initView({
					htmlId: self.options.htmlId,
					items: self.options.items,
					defaultOption: self.options.defaultOption
				}, {
					selected: function() {
						var selected = self.options.defaultOption.display_name;
						can.each(self.options.items, function(item) {
							if (self.options.state() === item.attr('name')) {
								selected = item.attr('display_name');
							}
						});
						return selected;
					},
					itemUrl: function (item) {
						return dropdownItemRoute(item);
					}
				}));
			}
		});
	}
);
