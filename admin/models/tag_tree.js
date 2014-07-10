steal('can/model', function(Model){

	return Model.extend({
		findAll : 'GET /api/v2/tags/tree'
	});
})