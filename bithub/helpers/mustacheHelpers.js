steal('can/view/mustache', 'vendor/moment').then(function () {

	Mustache.registerHelper('prettifyTs', function( ts, opts ) {
		ts = moment.utc(typeof(ts) === 'function' ? ts() : ts);

		var formats = {
			date: {
				today: "[Today]",
				nextDay: "[Tomorrow]",
				yesterday: "[Yesterday]",
				thisweek: "dddd",
				lastweek: "[Last] dddd",
				nextWeek: "dddd",
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
				nextDay: "[Tomorrow at] LT",
				thisweek: "dddd [at] LT",
				lastweek: "[Last] dddd [at] LT",
				nextWeek: "dddd [at] LT",
				_default: "L [at] LT"
			}
		};

		var format = (opts.hash && opts.hash.format && formats[opts.hash.format]) ? opts.hash.format : 'datetime';

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

		return ts.local().format(format);
	});

	Mustache.registerHelper('loop', function( collection, opts ) {
		var buffer = "",
		begin = (opts.hash && opts.hash.begin) || 0,
		length = (opts.hash && opts.hash.length) || collection.length,
		iOffset = (opts.hash && opts.hash.iOffset) || 0;

		if( !collection ) return buffer;

		if (collection.attr('length') > 0) {
			begin = (typeof(begin) === 'function') ? begin() : begin;
			length = (typeof(length) === 'function') ? length() : length;
			iOffset = (typeof(iOffset) === 'function') ? iOffset() : iOffset;

			for (var i = begin; i < begin+length && i < collection.length; i++) {
				collection[i].attr('__index', i + iOffset + 1);
				buffer += opts.fn( collection[i] );
			}
		}
		return buffer;
	});

	Mustache.registerHelper('ifequal', function( a, b, opts ) {
		a = (typeof(a) === 'function') ? a() : a;
		b = (typeof(b) === 'function') ? b() : b;

		return (a === b) ? opts.fn(this) : opts.inverse(this);
	});

	Mustache.registerHelper('substring', function( str, start, length, opts ) {
		str = (typeof(str) === 'function') ? str() : str;
		return str.substr( start, length );
	});

	Mustache.registerHelper('capitalize', function( str, opts ) {
		return can.capitalize( typeof(str) === 'function' ? str() : str );
	});

	Mustache.registerHelper('logObj', function( obj, opts ) {
		console.log( obj );
	});
});
