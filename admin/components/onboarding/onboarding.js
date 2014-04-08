steal(
'can/util/string',
'can/component',
'./onboarding.mustache',
'admin/components/homepage',
'admin/components/category_determination',
'admin/components/login',
'admin/components/onboarding',
'admin/components/organization',
'admin/components/scoring_rules',
'admin/components/dashboard',
'admin/components/services',
'admin/components/rewards',
'admin/components/tag_form',
'admin/components/admin_page',
function(can, Component, onboardingView){

  return can.Component({
	tag : 'onboarding',
	template : onboardingView,
	scope : {
	  
	},
	helpers : {
		whenState : function(stateName, opts){
			stateName = can.isFunction(stateName) ? stateName() : stateName;

			stateName = stateName.split(',')

			if(stateName.indexOf(this.attr('state')) !== -1){
				return opts.fn(opts.context)
			}
		},
		unlessState : function(stateName, opts){
			stateName = can.isFunction(stateName) ? stateName() : stateName;

			stateName = stateName.split(',')

			if(stateName.indexOf(this.attr('state')) === -1){
				return opts.fn(opts.context)
			}
		}
	}
  })

});