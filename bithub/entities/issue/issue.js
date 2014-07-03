steal(
'can/component',
'./issue.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/entities/events.js',
function(Component, issueView, EntityState, sharedHelpers, sharedEvents){
	can.Component.extend({
		tag : 'bh-issue',
		template : issueView,
		scope : EntityState.extend({
			inited : true,
			childrenExpanded : false,
			childrenExistAndExpanded : function(){
				return this.attr('childrenExpanded') && this.attr('event.children').attr('length') > 0;
			}
		}),
		helpers : can.extend({
			isAwarded : function(event, opts){
				return event.attr('props.thread_awarded');
			},
			double : function(val){
				val = can.isFunction(val) ? val() : val;
				return parseInt(val) * 2;
			}
		}, sharedHelpers),
		events : can.extend({}, sharedEvents)
	})
})
