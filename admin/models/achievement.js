steal(
	'can/model',
	function (Model) {
		
	return Model.extend('Bithub.Models.Achievement', {

		findAll : 'GET /api/v2/achievements',
		findOne : 'GET /api/v2/achievements/{id}',
		create  : 'POST /api/v2/achievements',
		update  : 'PUT /api/v2/achievements/{id}',
		destroy : 'DELETE /api/v2/achievements/{id}'

	}, {
		serialize : function(){
			var data = this._super();
			delete data.saving;
			return data;
		}
	});
});
