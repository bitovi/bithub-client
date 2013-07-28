steal('can/control', 'bithub/flagsnapper', function(Control, FlagSnapper){
	return Control({
		init : function(){
			this.FlagSnapper = new FlagSnapper( this.element, {} );
		},
		" rendered": function() {
			var self = this;
			setTimeout(function() {
				self.applyMore();
				self.adjustChatboxHeight();
				self.FlagSnapper.onscroll();
			}, 0);
		},

		applyMore: function() {
			this.element.find('.no-more').removeClass('no-more').more();
		},

		adjustChatboxHeight: function() {
			this.element.find('.no-chat-height').each(function (i, chat) {
				var $chat = $(chat);
				$chat.removeClass('no-chat-height');

				var calcHeight = 0;
				$chat.find('div.message').each(function (i, msg) {
					calcHeight += $(msg).height();
				});
				if (calcHeight < $chat.height()) {
					$chat.height(calcHeight);
				}
				chat.scrollTop = chat.scrollHeight;
			});
		}
	})

})