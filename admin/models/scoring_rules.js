steal('can/model', 'can/construct/super', function(Model){


	var ScoringRules = Model.extend({
		create : 'POST /api/v2/scoring_rules',
		update : 'PUT /api/v2/scoring_rules/{id}',
		findAll : 'GET /api/v2/scoring_rules',
		model : function(data){

			if(data.required_tags && data.required_tags.watch){
				data.required_tags.wtch = data.required_tags.watch;
				delete data.required_tags.watch;
			}

			return this._super(data);

			return 
		}
	},{
		serialize : function(){
			var data = this._super();

			if(data.required_tags && data.required_tags.wtch){
				data.required_tags.watch = data.required_tags.wtch;
				delete data.required_tags.wtch;
			}

			return {
				rule : data
			}
		}
	})

	return ScoringRules;
})