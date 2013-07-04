steal('can',
	  'vendor/moment/moment.min.js'
	 ).then( function() {

		 can.extend( can.EJS.Helpers.prototype, {
	  		 prettifyTs: function( ts, format ) {
				 ts = moment.utc(typeof(ts) === 'function' ? ts() : ts);

				 var formats = {
					 date: {
						 today: "[Today]",
						 yesterday: "[Yesterday]",
						 thisweek: "dddd",
						 lastweek: "[Last] dddd",
						 _default: "L"
					 },
					 time: {
						 today: "LT",
						 yesterday: "LT",
						 thisweek: "LT",
						 lastweek: "LT",
						 _default: "LT"
					 },
					 datetime: {
						 today: "[Today at] LT",
						 yesterday: "[Yesterday at] LT",
						 thisweek: "dddd [at] LT",
						 lastweek: "[Last] dddd [at] LT",
						 _default: "L [at] LT"
					 }
				 };
			 
				 format = (format && formats[format]) ? format : 'datetime';
			 	 
				 // calculate diff from date
				 var diff = moment.utc().second(0).minute(0).hour(0).diff( moment.utc(ts).second(0).minute(0).hour(0), 'days', true );
				 
				 if (diff < 1) {
					 format = formats[format].today;
				 } else if (diff < 2) {
					 format = formats[format].yesterday;
				 } else if (diff < 7) {
					 format = formats[format].thisweek;
				 } else if (diff < 14) {
					 format = formats[format].lastweek;
				 } else {
					 format = formats[format]._default;
				 }

				 return ts.format( format );
			 }
			 
		 });
		 
	 });
