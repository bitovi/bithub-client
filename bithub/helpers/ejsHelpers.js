steal('can',
	  'vendor/moment'
	 ).then( function() {

		 can.extend( can.EJS.Helpers.prototype, {
	  		 prettifyTs: function( ts, format, show ) {
				 ts = moment(typeof(ts) === 'function' ? ts() : ts);

				 var formats = {
					 date: {
						 today: "[Today]",
						 yesterday: "[Yesterday]",
						 tomorrow: "[Tomorrow]",
						 thisWeek: "dddd",
						 lastWeek: "[Last] dddd",
						 nextWeek: "[Next] dddd",
						 _default: "L"
					 },
					 time: {
						 today: "LT",
						 yesterday: "LT",
						 tomorrow: "LT",
						 thisWeek: "LT",
						 lastWeek: "LT",
						 nextWeek: "LT",
						 _default: "LT"
					 },
					 datetime: {
						 today: "[Today at] LT",
						 yesterday: "[Yesterday at] LT",
						 tomorrow: "[Tomorrow at] LT",
						 thisWeek: "dddd [at] LT",
						 lastWeek: "[Last] dddd [at] LT",
						 nextWeek: "[Next] dddd [at] LT",
						 _default: "L [at] LT"
					 }
				 };
			 
				 format = (format && formats[format]) ? format : 'datetime';
			 	 
				 // calculate diff from date
				 var diff = moment.utc().second(0).minute(0).hour(0).diff( moment.utc(ts).second(0).minute(0).hour(0), 'days', true );
				
				 if (show) console.log(diff);

				 if (diff > 0) {
					 if (diff < 1) {
						 format = formats[format].today;
					 } else if (diff < 2) {
						 format = formats[format].yesterday;
					 } else if (diff < 7) {
						 format = formats[format].thisWeek;
					 } else if (diff < 14) {
						 format = formats[format].lastWeek;
					 } else {
						 format = formats[format]._default;
					 }
				 } else if (diff < 0) {
					 if (diff > -2) {
						 format = formats[format].tomorrow;
					 } else if (diff > -7) {
						 format = formats[format].nextWeek;
					 } else {
						 format = formats[format]._default;
					 }
				 }

				 return ts.format( format );
				 // return ts.calendar();
			 }
			 
		 });
		 
	 });
