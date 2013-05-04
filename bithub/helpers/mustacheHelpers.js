steal('can/view/mustache',
	  'vendor/moment/moment.min.js',
	  'vendor/markdown',
	  'ui/more'
	 ).then( function () {

	  	 Mustache.registerHelper('prettifyTs', function( ts, opts ) {
			 ts = moment.utc(typeof(ts) === 'function' ? ts() : ts);
			 
			 var formats = {
				 'date': 'dddd',
				 'time': 'LT',
				 'datetime': 'dddd [at] LT'
			 };
			 var calendars = {
				 'date': {
					 lastDay: '[Yesterday]',
					 sameDay: '[Today]',
					 sameElse: 'L'
				 },
				 'time': {},
				 'datetime': {
					 lastDay: '[Yesterday at] LT',
					 sameDay: '[Today at] LT',
					 sameElse: 'L'
				 }
			 };
			 
			 var format = (opts.hash && opts.hash.format && formats[opts.hash.format]) ? opts.hash.format : formats.date;
			 			 
			 moment.lang('en', {
				 calendar: calendars[format]
			 });

			 if (moment().diff(ts, 'days') < 2) { // today and yesterday
				 return ts.calendar();
			 } else if (moment().diff(ts, 'days') < 7) {  // this week
				 return ts.format(formats[format]);
			 } else if (moment().diff(ts, 'days') < 14) { // past week
				 return 'Last ' + ts.format(formats[format]);
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

		 Mustache.registerHelper('iterByKeys', function( obj, keys, opts ) {
			 if (typeof(obj) === 'function') obj = obj();
			 var buffer = "";
			 can.each(keys, function (key) {
				 if (obj.attr(key)) {
					 buffer += opts.fn( {key: key, values: obj.attr(key)} );
				 }
			 });
			 return buffer;
		 });

		 Mustache.registerHelper('ifequal', function( a, b, opts ) {
			 return (a === b) ? opts.fn(this) : opts.inverse(this);
		 });

		 Mustache.registerHelper('substring', function( str, start, length, opts ) {
			 str = (typeof(str) === 'function') ? str() : str;
			 return str.substr( start, length );
		 });

		 Mustache.registerHelper('markdown', function( str, tags, opts ) {
			 str = (typeof(str) === 'function') ? str() : str;
			 tags = (typeof(tags) === 'function') ? tags() : tags;

			 var whitelist = ['issue_comment_event', 'issues_event', 'commit_comment_event'];
			 for (var i = 0; i < tags.length; i++) 
				 if ( whitelist.indexOf( tags[i] ) >= 0 ) {
					 return markdown.toHTML( str );
				 }
			 
			 return str;
		 });
								 
	 });
