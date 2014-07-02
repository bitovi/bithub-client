steal('can/util/string', './tracked_item.js', 'can/model', 'can/construct/super', function(can, TrackedItem){

	var names = {
		twitter : 'Twitter',
		github : 'GitHub',
		stackexchange : 'StackExchange',
		facebook : 'Facebook',
		meetup: 'Meetup'
	}

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
	}, {
		name : function(){
			var provider = this.attr('provider');
			return names[provider] || provider;
		}
	});

})