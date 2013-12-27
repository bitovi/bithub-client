steal(
'can/component',
'./twitter.mustache',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, twitterView, sharedHelpers){
	Component.extend({
		tag : 'bh-twitter',
		template : twitterView,
		scope : {
			dateFormat : function(){
				var format = 'datetime',
					date = this.attr('currentdate');

				if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
			
				return format;
			}
		},
		helpers : {
			linkToTwitterProfile: function(username) {
				username = can.isFunction(username) ? username() : username;
				return "https://twitter.com/" + username;
			},
			isEventUpvoted : sharedHelpers.isEventUpvoted
		}
	})
})