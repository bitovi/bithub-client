steal('can/util/string', 'can/model', 'can/construct/super', function(can){

	return can.Model({

		findAll : 'GET /api/v2/feed_configs',
		findOne : 'GET /api/v2/feed_configs/{id}',
		create  : 'POST /api/v2/feed_configs',
		update  : 'PUT /api/v2/feed_configs/{id}',
		destroy : 'DELETE /api/v2/feed_configs/{id}'

	}, {
		serialize : function(){
			var data = this._super();
			return {
				feed_config : data
			}
		}
	});

})