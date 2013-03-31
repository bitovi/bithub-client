steal('can',
	  function (can) {
		  return can.Model({
			  findAll : 'GET /api/tags',
			  findOne : 'GET /api/tags/{id}',
			  create  : 'POST /api/tags',
			  update  : 'PUT /api/tags/{id}',
			  destroy : 'DELETE /api/tags/{id}'
		  }, {});
	  });
