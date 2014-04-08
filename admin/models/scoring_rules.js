steal('can/model', 'can/construct/super', function(Model){


	var ScoringRules = Model.extend({
		create : 'POST /api/v2/scoring_rules',
		update : 'PUT /api/v2/scoring_rules/{id}',
		findAll : 'GET /api/v2/scoring_rules'
	},{
		serialize : function(){
			var data = this._super();
			return {
				rule : data
			}
		}
	})

	return ScoringRules;
})