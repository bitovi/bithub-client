steal('can',
	  function (can) {
		  return can.Model({

			  // CRUD
			  findAll : 'GET /api/tags',
			  findOne : 'GET /api/tags/{id}',
			  create  : 'POST /api/tags',
			  update  : 'PUT /api/tags/{id}',
			  destroy : 'DELETE /api/tags/{id}',

			  categories: function (params, success, error) {
				  can.ajax({
					  url: '/api/tags/categories',
					  type: 'GET',
					  async: true,
					  dataType: 'json',
					  success: function(data) { success(data['data']); },
					  error: error
				  });
			  },

			  projects: function (params, success, error) {
				  can.ajax({
					  url: '/api/tags/projects',
					  type: 'GET',
					  async: true,
					  dataType: 'json',
					  success: function(data) { success(data['data']); },
					  error: error
				  });
			  }

		  }, {});
	  });
