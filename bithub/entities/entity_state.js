steal('can/map', 'can/map/attributes', function(Map){

	return Map.extend({}, {
		inited : false,
		projects : function(){
			return window.PROJECTS;
		},
		categories : function(){
			return window.CATEGORIES;
		},
		visibleTags : function(){
			return window.VISIBLE_TAGS || new can.List();
		},
		dateFormat : function(){
			var format = 'datetime',
				date = this.attr('currentdate');

			if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
		
			return format;
		},
		childrenExpanded : false,
		childrenExistAndExpanded : function(){
			return this.attr('childrenExpanded') && this.attr('event.children').attr('length') > 0;
		},
		toggleChildren : function(){
			this.attr('childrenExpanded', !this.attr('childrenExpanded'));
		},
		eventIsUpvoted : function(){
			return window.CURRENT_USER.hasVotedFor(this.attr('event'));
		}
	})

})