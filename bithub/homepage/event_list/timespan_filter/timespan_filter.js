steal(
	'can',
	'./init.ejs',
	function( can, initView ) {

		var timespans = [{
			value: 'day',
			display: 'Today'
		}, {
			value: 'week',
			display: 'This Week'
		}, {
			value: 'month',
			display: 'This Month'
		}, {
			value: 'all',
			display: 'All Time'
		}];

		return can.Control.extend({
			init: function( el, opts ) {
				el.html( initView({
					items: timespans
				}, {
					isSelected: function( value ) {
						if( can.route.attr('timespan') === value ) {
							// replace with css class name when design is ready
							return "text-decoration: underline";
						}
					}
				}) );
			},

			'a click': function( el, ev ) {
				ev.preventDefault();
				can.route.attr('timespan', can.data(el, 'value') );
			}
		});		  
	}
);
