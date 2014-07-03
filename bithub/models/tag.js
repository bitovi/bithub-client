steal('can',
		function (can) {
			return can.Model('Bithub.Models.Tag', {

				// CRUD
				findAll : 'GET /api/v2/tags',
				findOne : 'GET /api/v2/tags/{id}',
				create  : 'POST /api/v2/tags',
				update  : 'PUT /api/v2/tags/{id}',
				destroy : 'DELETE /api/v2/tags/{id}',

				allowedCategoriesForNewPost: ['article', 'app', 'plugin', 'event'],
				allowedCategoriesForExistingPost: ['article', 'app', 'plugin', 'event', 'twitter', 'bug', 'feature', 'question', 'comment', 'document_js'],
				allowedProjectsForNewPost: ['canjs', 'jquerypp', 'donejs', 'javascriptmvc', 'funcunit', 'stealjs', 'canui', 'document_js', 'testee', 'documentjs'],
				allowedProjectsForExistingPost: ['canjs', 'jquerypp', 'donejs', 'javascriptmvc', 'funcunit', 'stealjs', 'canui', 'document_js', 'testee', 'documentjs']
			}, {});
		});
