steal('can/view/mustache',
	  'vendor/moment/moment.min.js',
	  function () {

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

	  	  can.Mustache.registerHelper('humanizeTs', function( ts, opts ) {
			  ts = moment.utc(ts);
			  
			  moment.lang('en', {
				  calendar: {
					  lastDay: '[Yesterday at] LT',
					  sameDay: '[Today at] LT',
					  sameElse: 'L'
				  }
			  });

			  if (moment().diff(ts, 'days') < 2) { // today and yesterday
				  return ts.calendar();
			  } else if (moment().diff(ts, 'days') < 7) {  // this week
				  return ts.format('dddd [at] LT');
			  } else if (moment().diff(ts, 'days') < 14) { // past week
				  return 'Last ' + ts.format('dddd [at] LT');
			  } else {
				  return ts.calendar();
			  }
		  });
		  
	  });
