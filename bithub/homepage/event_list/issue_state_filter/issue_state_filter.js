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
			display: 'All Issues'
		}];

		return can.Control.extend({
			init: function( el, opts ) {
				el.html( initView({
					items: states
				}, {
					isSelected: function( value ) {
						var state = can.route.attr('state');

						if( (state && state === value) || (!state && value === 'both') ) {
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
