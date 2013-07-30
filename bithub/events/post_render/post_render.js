steal('can/control', 'bithub/flagsnapper', function(Control, FlagSnapper){
	return Control({
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

})