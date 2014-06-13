steal(
	'can',
	'can/list',
	'vendor/moment',
	function (can) {
		
		var Model = can.Model('Bithub.Models.Achievement', {

			findAll : 'GET /api/v1/achievements',
			findOne : 'GET /api/v1/achievements/{id}',
			create  : 'POST /api/v1/achievements',
			update  : 'PUT /api/v1/achievements/{id}',
			destroy : 'DELETE /api/v1/achievements/{id}'

		}, {
			serialize : function(){
				var data = this._super();
				delete data.saving;
				return data;
			}
		});
		
		return Model;
	});
