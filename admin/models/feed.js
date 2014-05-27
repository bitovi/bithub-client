steal('can/util/string', 'can/model', 'can/construct/super', function(can){

	return can.Model({

		findAll : 'GET /api/v2/tags/tree',
		id : 'name',
		models : function(data){
			return this._super(data.feeds);
		}

	}, {

	});

})