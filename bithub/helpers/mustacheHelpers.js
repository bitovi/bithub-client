steal('can/view/mustache',
	  'vendor/moment/moment.min.js',
	  'vendor/markdown',
	  'ui/more'
	 ).then( function () {

		 Mustache.registerHelper('humanizeDate', function( date, opts ) {
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
		 
	  	 Mustache.registerHelper('humanizeTs', function( ts, opts ) {
			 ts = moment.utc(typeof(ts) === 'function' ? ts() : ts);
			 
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

		 Mustache.registerHelper('loop', function( collection, opts ) {
			 var buffer = "",
				 begin = opts.hash.begin || 0,
				 length = opts.hash.length || collection.length;
			 
			 if (collection.attr('length') > 0) {
				 for (var i = begin; i < length && i < collection.length; i++) {
					 buffer += opts.fn( collection[i] );
				 }
			 }
			 return buffer;
		 });

		 Mustache.registerHelper('ifequal', function( a, b, opts ) {
			 return (a === b) ? opts.fn(this) : opts.inverse(this);
		 });

		 Mustache.registerHelper('substring', function( str, start, length, opts ) {
			 str = (typeof(str) === 'function') ? str() : str;
			 return str.substr( start, length );
		 });

		 Mustache.registerHelper('markdown', function( str, opts ) {
			 str = (typeof(str) === 'function') ? str() : str;
			 return markdown.toHTML( str );
		 });

		 Mustache.registerHelper('more', function( str, opts ) {
			 str = (typeof(str) === 'function') ? str() : str;

			 return str;
		 });
	 });
