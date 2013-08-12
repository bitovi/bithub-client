steal(
	'can',
	'./init.ejs',
	function(can, initView){

		var makeRouteForOption = function (item) {
			return can.route.url({
				category: can.route.attr('category') || 'all',
				project: can.route.attr('project') || 'all',
				view: item.name
			}, false);
		};

		return can.Control.extend({
			pluginName: 'options-selector',
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this,
				items = new can.Observe.List(opts.items);

				elem.html(initView({
					items: items
				},{
					isSelected: function( item ) {
						var itemName = _.isFunction(item) ? item() : item.name;
						return (self.options.state() === itemName) ? 'active' : '';
					},
					itemUrl: function (item) {
						console.log(item.url);
						return item.url || makeRouteForOption(item);
					}
				}));
			}

		});
	}
);
