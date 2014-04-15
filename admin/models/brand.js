steal('can/util/string', './brand_identity.js', 'can/model', 'can/map/attributes', 'can/construct/super', function(can, BrandIdentity){

	return can.Model({

		findOne : 'GET /api/v2/brands/brand',
		attributes : {
			identities : BrandIdentity
		},
		model : function(data){
			return this._super(data.data);
		}
	}, {
		reload : function(){
			var self = this;
			this.attr('_reloading', true);
			this.constructor.findOne({}, function(){
				self.attr('_reloading', false);
			});
		}
	});

})