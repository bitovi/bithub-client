steal(
	'can',
	'./filterbar.mustache',
	'ui/optionselector',
	'ui/dropdownselector',
	'ui/smartselector',
	function(can, filterbarView, OptionSelector, DropdownSelector, SmartSelector){

		return can.Control.extend({
			pluginName: 'filterbar',
			defaults : { }
		}, {

			init: function( elem, options ) {
				elem.html(filterbarView());

				new OptionSelector(elem.find('#viewFilter'), {
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

				new SmartSelector(elem.find('#categoryFilter'), {
					categories: options.categories,
					state: function (newVal) {
						return can.route.attr('category');
					}
				});
			}
		});
	}
);
