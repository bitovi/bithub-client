steal(
'can/component',
'./default.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, defaultView, EntityState, sharedHelpers){
	can.Component.extend({
		tag : 'bh-default',
		template : defaultView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({}, sharedHelpers)
	})
})