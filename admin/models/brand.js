steal('can/util/string', './brand_identity.js', 'can/model', 'can/map/attributes', 'can/construct/super', function(can, BrandIdentity){

	return can.Model({

		findOne : 'GET /api/v2/brands/brand',
		update : 'PUT /api/v2/brands/brand',
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
			}, function(err){
				console.log(err.stack)
			});
		},
		serialize : function(){
			var data = this._super();

			if(data.keywords && data.keywords.length === 0){
				data.keywords = null;
			}

			return {
				brand : data
			}
		},
		keywordList : function(){
			var keywords = this.attr('keywords').attr();

			if(keywords.indexOf(this.attr('name')) === -1){
				keywords.push(this.attr('name'));
			}

			return new can.List(can.map(keywords, function(keyword){
				return {id: keyword, name: keyword};
			}));
		}
	});

})