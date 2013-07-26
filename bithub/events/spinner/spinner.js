steal('can/control', function(Control){
	return Control({
		'{spinner} change': function( fn, ev, newVal, oldVal ) {
			var el = this.element,
				preservedHeight = el.css('height'); // To prevent content bobbing (caused by removing of scrollbar in FF);

			if( newVal ) {
				$(document).scrollTop(0);
				el.css('height', preservedHeight);
				el.find('.events-container').hide();
				el.find('.spinner').show()
			} else {
				el.css('height', 'auto');
				el.find('.spinner').hide()
				el.find('.events-container').show();
			}
		},

		'{spinnerBottom} change': function( fn, ev, newVal, oldVal ) {
			var $spinner = this.element.find('.spinnerBottom');

			newVal ? $spinner.show() : $spinner.hide();
		}
	})
})