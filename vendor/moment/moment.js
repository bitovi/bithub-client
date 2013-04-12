steal('can/view/mustache').then('vendor/moment/moment.min.js', function () {

	can.Mustache.registerHelper('humanizeDate', function( date, opts ) {
		date = moment.utc(date);

		moment.lang('en', {
			calendar: {
				lastDay: '[Yesterday]',
				sameDay: '[Today]',
				sameElse: 'L'
			}
		});

		if (moment().diff(date, 'days') < 2) { // today and yesterday
			return date.calendar();
		} else if (moment().diff(date, 'days') < 7) {  // this week
			return date.format('dddd');
		} else if (moment().diff(date, 'days') < 14) { // past week
			return 'Last ' + date.format('dddd');
		} else {
			return date.calendar();
		}
	});
	
});
