steal(
	'can',
	'bithub/models/pagination.js',
	function(can, Pagination) {

		var defaultParams = Pagination.defaultParams();

		var filters = function() {
			var params = {tags: []};
			
			if (can.route.attr('project') !== 'all') params.tags.push( can.route.attr('project') );
			if (can.route.attr('category') !== 'all') params.tags.push( can.route.attr('category') );

			// hack for bug/feature state
			if( ['bug','feature'].indexOf( can.route.attr('category') ) >= 0 ) {
				var state = can.route.attr('state') || 'open';
				if(['open','closed'].indexOf( state ) >= 0) params.tags.push( state );
			}
			
			return params;
		}

		return can.Construct.extend({
			init: function( cb ) {
				this.idx = 0;
				this.canLoad = true;
				this.list = new can.Observe.List();
				this.params = can.extend({}, defaultParams);
				
				this.updateList( cb );
			},

			current: function() {
				return this.list[this.idx];
			},

			hasNext : function(){
				return this.idx < this.list.length - 1;
			},

			next: function() {
				if(this.idx < this.list.length-1) {
					this.idx++;
				} else {
					return false;
				}
				
				if( this.canLoad && (this.idx >= this.list.length-3) ) {
					this.params.offset += this.params.limit;
					this.appendList();
				}
				return this.current();
			},
			
			updateList: function( cb ) {
				var self = this,
					params = can.extend({}, this.params, filters());

				this.canLoad && Pagination.getDateSpans(params, function( spans ) {
					if( spans.length == 0) { 
						self.canLoad = false; 
					}
					self.list.replace( spans );
					cb && cb();
				});
			},

			appendList: function( cb ) {
				var self = this,
					params = can.extend({}, this.params, filters());

				this.canLoad && Pagination.getDateSpans(params, function( spans ) {

					if( spans.length == 0) { 
						self.canLoad = false; 
					}

					if(spans.length && self.list.indexOf(spans[0]) === -1){
						self.list.push.apply(self.list, spans);
					}

					cb && cb();
				});
			},

			reset: function( cb ) {
				this.idx = 0;
				this.params.offset = 0;
				this.canLoad = true;
				this.updateList( cb );
			}
		});
		
	});
