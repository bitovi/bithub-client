steal(
	'can',
	'bithub/models/pagination.js',
	function(can, Pagination) {

		var defaultParams = Pagination.defaultParams();

		var filters = function() {
			var params = {tags: []};
			
			if (can.route.attr('project') !== 'all') params.tags.push( can.route.attr('project') );
			if (can.route.attr('category') !== 'all') params.tags.push( can.route.attr('category') );

			return params;
		}

		return can.Construct.extend({
			init: function( list ) {
				this.idx = 0;
				this.canLoad = true;

				if( list ) {
					this.list = list;
				} else {
					this.list = new can.Observe.List();
					this.load();
				}

				this.params = can.extend({}, defaultParams);
			},

			current: function() {
				return this.list[this.idx];
			},

			next: function() {
				if(this.idx < this.list.length-1) { this.idx++; }
				
				if( this.canLoad && (this.idx >= this.list.length-3) ) {
					this.params.offset += this.params.limit;
					this.load();
				}
				return this.current();
			},
			
			load: function( cb ) {
				var self = this,
					params = can.extend({}, this.params, filters());

				this.canLoad && Pagination.getDateSpans(params, function( spans ) {
					if( spans.length == 0) { self.canLoad = false; }
					self.list.push.apply(self.list, spans);
					cb && cb();
				});
			},

			reset: function( cb ) {
				this.idx = 0;
				this.load( cb );
			}
		});
		
	});
