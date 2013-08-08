steal(
	'can',
	'./init.ejs',
	'vendor/bootstrap',
	function(can, initView){
		var makeRouteForOption = can.compute(function(item) {
			return can.route.url({
				project: item.name,
				category: can.route.attr('category') || 'all',
				view: can.route.attr('view') || 'all'
			}, false);
		});

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
						return item.url || makeRouteForOption(item);
					}
				}));
			}
		});
	}
);
