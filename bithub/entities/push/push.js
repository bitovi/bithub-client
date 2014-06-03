steal(
'can/component',
'./push.mustache!',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, pushView, EntityState, sharedHelpers){
	can.Component.extend({
		tag : 'bh-push',
		template : pushView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({}, sharedHelpers)
	})
})