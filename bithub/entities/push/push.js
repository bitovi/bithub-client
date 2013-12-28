steal(
'can/component',
'./push.mustache',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, pushView, sharedHelpers){
	can.Component.extend({
		tag : 'bh-push',
		template : pushView,
		scope : {
			inited : true,
			dateFormat : function(){
				var format = 'datetime',
					date = this.attr('currentdate');

				if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
			
				return format;
			}
		},
		helpers : {
			eventUrl : sharedHelpers.eventUrl
		}
	})
})