steal(
	'can',
	'can/construct/proxy',
	function(can) {
		return can.Control.extend({
			defaults : {
				offset: 70
			}
		}, {
			init : function( elem, opts ){
				this.on( document, 'scroll', this.proxy('onscroll') );
			},

			'onscroll': function() {
				var self = this,
				windowOffset = $(window).scrollTop();

				$('.sep.blue').each( function(i, el) {
					var $el = $(el);
					var fromTop = $el.offset().top - self.options.offset,
					cssPosition = $el.css('position');

					if( (cssPosition != 'fixed') && (fromTop < windowOffset) ) {
						$el.data('fromTop', fromTop);
						$el.css({position: 'fixed', top: self.options.offset+'px', 'z-index': 1000+i});
					}

					if( (cssPosition === 'fixed') && ($el.data('fromTop') >= windowOffset) ) {
						$el.css({position: 'static'});
					}
				});
			}

		});
	}
);
