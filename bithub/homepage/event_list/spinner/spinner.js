steal(
	'can/control',
	function(Control){
		return Control.extend({
			'{spinnerTop} change': function( fn, ev, newVal, oldVal ) {
				var el = this.element,
					preservedHeight = el.css('height'); // To prevent content bobbing (caused by removing of scrollbar in FF);

				if( newVal ) {
					$(document).scrollTop(0);
					el.css('height', preservedHeight);
					el.find('.event-list').hide();
					el.find('.spinner-top').show()
				} else {
					el.css('height', 'auto');
					el.find('.spinner-top').hide()
					el.find('.event-list').show();
				}
			},

			'{spinnerBottom} change': function( fn, ev, newVal, oldVal ) {
				var $spinner = this.element.find('.spinner-bottom');
				newVal ? $spinner.show() : $spinner.hide();
			}
		})
	})
