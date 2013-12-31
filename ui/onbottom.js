steal(
	'can',
	'vendor/lodash',
	'can/construct/super',
	'can/construct/proxy',
	function () {
		return can.Control('UI.Onbottom', {
			defaults: { 
				threshold: 50,
				onbottom: false
			}
		}, {
			setup : function(){
				var oldTrigger = this.trigger,
					self = this;
				this.trigger = _.throttle(function(){
					oldTrigger.call(self);
				}, 100);
				this._super.apply(this, arguments);
			},
			init: function(element, options) {

			},

			'scroll': "trigger",
			'{window} resize': "trigger",
			'{window} resetOnBottom': function(){
				delete this.__elemHeight;
			},

			trigger: function () {
				var elemHeight   = this.element.height(),
					windowHeight = $(window).innerHeight(),
					scrollTop    = $(window).scrollTop(),
					diff         = Math.abs(scrollTop - (elemHeight - windowHeight));

				if(diff < this.options.threshold && this.__elemHeight !== elemHeight){
					this.__elemHeight = elemHeight;
					this.element.trigger('onbottom');
				}
			}
			
		});
	});
