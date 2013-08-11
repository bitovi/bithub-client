steal(
	'can',
	'./init.ejs',
	function( can, initView ) {

		var states = [{
			value: 'open',
			display: 'Open'
		}, {
			value: 'closed',
			display: 'Closed'
		}, {
			value: 'both',
			display: 'Both'
		}];

		return can.Control.extend({
			init: function( el, opts ) {
				el.html( initView({
					items: states
				}, {
					isSelected: function( value ) {
						if( can.route.attr('state') === value ) {
							return "text-decoration: underline";
						}
					}
				}) );
			},

			'a click': function( el, ev ) {
				ev.preventDefault();
				can.route.attr('state', can.data(el, 'value') );
			}
		});		  
	}
);
