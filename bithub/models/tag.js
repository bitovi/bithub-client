steal('can',
		function (can) {
			return can.Model('Bithub.Models.Tag', {

				// CRUD
				findAll : 'GET /api/tags',
				findOne : 'GET /api/tags/{id}',
				create  : 'POST /api/tags',
				update  : 'PUT /api/tags/{id}',
				destroy : 'DELETE /api/tags/{id}',

				allowedCategoriesForNewPost: ['article', 'app', 'plugin', 'event'],
				allowedCategoriesForExistingPost: ['article', 'app', 'plugin', 'event', 'twitter', 'bug', 'feature', 'question', 'comment'],
				allowedProjectsForNewPost: ['canjs', 'jquerypp', 'donejs', 'javascriptmvc', 'funcunit', 'stealjs', 'canui', 'document_js', 'testee']
			}, {});
		});
