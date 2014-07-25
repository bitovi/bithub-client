steal('can/model', 'can/construct/super', function(Model){

	var prepareTags = function(tags){
		return can.map(function(tag){
			if(typeof tag === 'string'){
				return {
					name : tag
				}
			}
			return tag;
		})
	}

	return Model({
		findAll : 'GET /api/v2/funnels.json',
		findOne : 'GET /api/v2/funnels/{id}.json',
		create : 'POST /api/v2/funnels.json',
		update : 'PUT /api/v2/funnels/{id}.json',
		destroy : 'DELETE /api/v2/funnels/{id}.json'
	},{
		init : function(){
			this.attr('tags', prepareTags(this.attr('tags') || []));
			this.attr('constraints', this.attr('constraints') || []);
		},
		serialize : function(){
			var data = this._super();
			
			data.tags = can.map(data.tags, function(tag){
				if(typeof tag !== 'string'){
					return tag.name;
				}
			});

			return {
				funnel : data
			}
		},
		addConstraint : function(){
			
			this.attr('constraints').push({
				feed_name : "",
				type_name : ""
			})
		},
		removeConstraint : function(constraint){
			var constraints = this.attr('constraints'),
				index = constraints.indexOf(constraint);

			constraints.splice(index, 1);
		}
	})
})