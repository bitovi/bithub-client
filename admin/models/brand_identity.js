steal('can/util/string', './tracked_item.js', 'can/model', 'can/construct/super', function(can, TrackedItem){

	return can.Model({

		findAll : 'GET /api/v2/brand_identities',
		findOne : 'GET /api/v2/brand_identities/{id}',
		model : function(data){
			var provider = data.provider;

			if(TrackedItem.normalizers[provider]){
				data = TrackedItem.normalizers[provider](data);
			}

			return this._super(data);
		}
	}, {});

})