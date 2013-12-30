steal(
'can/component',
'./twitter.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, twitterView, EntityState, sharedHelpers){
	Component.extend({
		tag : 'bh-twitter',
		template : twitterView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({
			linkToTwitterProfile: function(username) {
				username = can.isFunction(username) ? username() : username;

				can.__clearReading();

				return "https://twitter.com/" + username;
			}
		}, sharedHelpers)
	})
})