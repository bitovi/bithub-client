steal('can/component', './status-bar.mustache', function(Component, statusBarView){
	Component.extend({
		tag : 'bh-status-bar',
		template : statusBarView,
		scope : {
			dateFormat : function(){
				var format = 'datetime',
					date = this.attr('currentdate');

				if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
			
				return format;
			},
			toggleChildren : function(){
				this.attr('expanded', !this.attr('expanded'));
			}
		}
	})
})