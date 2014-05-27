steal(
'can/util/string',
'can/component',
'./scoring_rules.mustache',
'admin/models/scoring_rules.js',
'./scoring_rules.less',
'admin/components/tag_selection',
function(can, Component, scoringRulesView, ScoringRules){

	var Feeds = {
		twitter : 'Twitter',
		github : 'GitHub',
		meetup : 'Meetup',
		disqus : 'Disqus',
		stackexchange : 'StackExchange',
		foursquare : 'Foursquare'
	}

	var _keys = function(obj){
		var ks = [];
		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				ks.push(k);
			}
		}
		return ks;
	}

	return can.Component({
		tag : 'scoring-rules',
		template : scoringRulesView,
		scope : {
			init : function(){
				ScoringRules.findAll({}, this.proxy('updateScoringRules'))
			},
			updateScoringRules : function(rules){
				this.attr('scoringRules', rules);
				console.log(rules)
			},
			groupedRules : function(){
				var grouped = [],
					rules = this.attr('scoringRules'),
					keys = _keys(Feeds),
					indices = {};

				if(rules && rules.attr('length')){
					can.each(rules, function(rule){
						var tags  = rule.attr('required_tags'),
							group = {label: 'General', name: 'general'};

						for(var i = 0; i < keys.length; i++){
							if(tags.indexOf(keys[i]) > -1){
								group = {label: Feeds[keys[i]], name: keys[i]};
								break;
							}
						}

						if(typeof indices[group.name] === 'undefined'){
							grouped.push(group);
							indices[group.name] = grouped.length - 1;
							grouped[indices[group.name]].rules = [];
						}

						grouped[indices[group.name]].rules.push(rule) 
					})
				}
				return grouped;
			},
			saveRules : function(){
				var scoringRules = this.attr('scoringRules'),
					self = this,
					scoringRuleDeferreds = can.map(scoringRules, function(scoringRule){
						return scoringRule.save();
					})

				this.attr('isSaving', true);

				$.when(scoringRuleDeferreds).then(function(){
					self.attr('isSaving', false);
				});
			},
			isSaving : false
		}
	})

});