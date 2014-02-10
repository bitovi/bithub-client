steal('can',
		function (can) {
			return can.Model('Bithub.Models.Tag', {

				// CRUD
				findAll : 'GET /api/v1/tags',
				findOne : 'GET /api/v1/tags/{id}',
				create  : 'POST /api/v1/tags',
				update  : 'PUT /api/v1/tags/{id}',
				destroy : 'DELETE /api/v1/tags/{id}',

				allowedCategoriesForNewPost: ['article', 'app', 'plugin', 'event'],
				allowedCategoriesForExistingPost: ['article', 'app', 'plugin', 'event', 'twitter', 'bug', 'feature', 'question', 'comment', 'document_js'],
				allowedProjectsForNewPost: ['canjs', 'jquerypp', 'donejs', 'javascriptmvc', 'funcunit', 'stealjs', 'canui', 'document_js', 'testee', 'documentjs']
			}, {});
		});
