// Load all of the plugin dependencies
steal(
	'can',
	'app/models/tags.js',
	function(can, Tags) {
		return can.Control({
			page: 'latest',
			project: '',
			category: ''
		}, {
			init: function () {
				var self = this;

				Tags.projects({}, function (projects) {
					Tags.categories({}, function(categories) {						
						self.element.html( can.view('filterbar/filterbar.mustache', {
							projects: projects,
							categories_outlined: categories.splice(0,3),
							categories: categories
						}) );
					});
				});

			},
			'#projectOptions a click': function (el, ev) {
				var self = this;

				self.element.find('#projectTitle').html( can.data($(el), 'project').display_name );

				ev.preventDefault();
			}
		});
	});
