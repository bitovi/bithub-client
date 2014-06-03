steal(
	'can',
	'./filterbar.mustache!',
	'ui/radio_selector',
	'ui/dropdown_selector',
	'ui/lru_selector',
	function(can, filterbarView, RadioSelector, DropdownSelector, LRUSelector){

		return can.Control.extend({
			pluginName: 'filterbar',
			defaults : { }
		}, {

			init: function( elem, options ) {
				elem.html(filterbarView({}));

				new RadioSelector(elem.find('#viewFilter'), {
					items: [{ 
						name: 'latest',
						display_name: 'Latest'
					}, {
						name: 'greatest',
						display_name: 'Greatest'
					}],
					state: function (newVal) {
						return can.route.attr('view');
					}
				});

				new DropdownSelector(elem.find('#projectFilter'), {
					items: options.projects,
					state: function (newVal) {
						return can.route.attr('project');
					}
				});

				new LRUSelector(elem.find('#categoryFilter'), {
					categories: options.categories,
					state: function (newVal) {
						return can.route.attr('category');
					}
				});
			}
		});
	}
);
