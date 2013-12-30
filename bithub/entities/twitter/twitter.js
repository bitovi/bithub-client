steal(
'can/component',
'./twitter.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
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