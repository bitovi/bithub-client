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
			init: function( elem, opts ) {
				elem.html( initView({
					items: timespans
				}, {
					isSelected: function( val ) {
						return (val == can.route.attr('timespan')) ? 'selected="selected"' : '';
					}
				}) );
			},

			'select change': function( el, ev ) {
				ev.preventDefault();
				can.route.attr('timespan', el.val() );
			}
		});
	}
);
