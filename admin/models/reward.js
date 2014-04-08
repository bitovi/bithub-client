steal('can/model', 'can/construct/super', function(Model){
	return Model({
		findAll : 'GET /api/v2/rewards.json',
		create : 'POST /api/v2/rewards.json',
		update : 'PUT /api/v2/rewards/{id}.json',
		destroy : 'DELETE /api/v2/rewards/{id}.json'
	},{
		serialize : function(){
			var data = this._super();
			return {
				reward : data
			}
		}
	})
})