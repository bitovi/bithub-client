steal('can',
	  'can/observe/sort',
	  'vendor/moment'
	 ).then( function() {

		 can.extend( can.EJS.Helpers.prototype, {
	  		 prettifyTs: function( ts, format) {
				 ts = moment.utc(typeof(ts) === 'function' ? ts() : ts);

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

				 return ts.local().format(format);
			 },

			 linkToTwitterProfile: function(username) {
				 return "https://twitter.com/" + username;
			 },

			 sortChildren: function(collection, attribute, direction) {
				 var dateAttributes = ['origin_ts', 'origin_date', 'thread_updated_at', 'thread_updated_date'],
					 numericAttributes = ['points'],
					 isSmaller = (direction === 'asc') ? -1 : 1,
					 isLarger = (direction === 'asc') ? 1 : -1;

				 if (dateAttributes.indexOf(attribute) > -1) {
					 collection.sort(function(a,b) {
						 return (moment(a.attr(attribute)).isBefore(b.attr(attribute)) ? isSmaller : isLarger);
					 })
				 } else if (numericAttributes.indexOf(attribute)) {
					 collection.sort(function(a,b) {
						 return (parseInt(a.attr(attribute),10) <= parseInt(b.attr(attribute), 10) ? isSmaller : isLarger);
					 })
				 } else {
					 collection.sort(function(a,b) {
						 return (a.attr(attribute) <= b.attr(attribute) ? isSmaller : isLarger);
					 })
				 }

				 return collection;
			 },

			 filterUrl: function ( item ) {			
				 return can.route.url( can.extend({}, {
					 category: can.route.attr('category') || 'all',
					 project: can.route.attr('project') || 'all',
					 view: can.route.attr('view') || 'all',
					 timespan: can.route.attr('timespan') || 'all'
				 }, item), false );
			 }
		 });
	 });
