steal(
	'can/control',
	'bithub/homepage/event_list/flagsnapper',
	function(Control, FlagSnapper){

		return Control.extend({
			init : function(){
				this.FlagSnapper = new FlagSnapper( this.element, {} );
			},

			" rendered": function() {
				var self = this;
				setTimeout(function() {
					self.applyMore();
					self.FlagSnapper.onscroll();
				}, 0);
			},

			applyMore: function() {
				this.element.find('.no-more').removeClass('no-more').more();
			}
		})
	}
);
