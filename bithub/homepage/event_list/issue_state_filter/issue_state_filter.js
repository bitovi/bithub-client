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
					isSelected: function( val ) {
						return (val == can.route.attr('state')) ? 'selected="selected"' : '';
					}
				}) );
			},

			'select change': function( el, ev ) {
				ev.preventDefault();
				can.route.attr('state', el.val() );
			}
		});		  
	}
);
