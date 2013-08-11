steal(
	'can',
	'./init.ejs',
	function( can, initView ) {

		var timespans = [{
			value: 'day',
			display: 'Day'
		}, {
			value: 'week',
			display: 'Week'
		}, {
			value: 'month',
			display: 'Month'
		}, {
			value: 'all',
			display: 'All time'
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
