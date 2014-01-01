steal(
'can/component',
'./issue.mustache',
'./child.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, issueView, childEventView, EntityState, sharedHelpers){
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
				can.__clearReading();
				return parseInt(val) * 2;
			}
		}, sharedHelpers)
	})
})