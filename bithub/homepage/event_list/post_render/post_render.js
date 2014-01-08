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
					self.FlagSnapper.onscroll();
				}, 0);
			}
		})
	}
);
