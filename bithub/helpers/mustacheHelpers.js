steal('can/view/mustache', 'vendor/moment', function (Mustache) {

	can.Mustache.registerHelper('prettifyTs', function( ts, format, opts ) {

		ts     = moment.utc(can.isFunction(ts) ? ts() : ts);
		format = can.isFunction(format) ? format() : format;

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

		can.__clearReading();

		return ts.local().format(format);
	});
	
	can.Mustache.registerHelper('loop', function( collection, opts ) {
		var buffer = "",
			begin = (opts.hash && opts.hash.begin) || 0,
			length = (opts.hash && opts.hash.length) || collection.length,
			iOffset = (opts.hash && opts.hash.iOffset) || 0,
			reverse = (opts.hash && opts.hash.reverse) || false;

		collection = (typeof(collection) === 'function') ? collection() : collection;
		if( !collection ) return buffer;
		
		if (collection.attr('length') > 0) {
			begin = (typeof(begin) === 'function') ? begin() : begin;
			length = (typeof(length) === 'function') ? length() : length;
			iOffset = (typeof(iOffset) === 'function') ? iOffset() : iOffset;

			if( !reverse ) {
				for (var i = begin; i < begin+length && i < collection.length; i++) {
					collection[i].attr('__index', i + iOffset + 1);
					buffer += opts.fn( collection[i] );
				}
			} else {
				for (var i = begin+length-1; i >= begin && i >= 0; i--) {
					collection[i].attr('__index', i + iOffset + 1);
					buffer += opts.fn( collection[i] );
				}
			}
		}
		return buffer;
	});

	can.Mustache.registerHelper('ifequal', function( a, b, opts ) {
		a = (typeof(a) === 'function') ? a() : a;
		b = (typeof(b) === 'function') ? b() : b;

		return (a === b) ? opts.fn(this) : opts.inverse(this);
	});

	can.Mustache.registerHelper('substring', function( str, start, length, opts ) {
		str = (typeof(str) === 'function') ? str() : str;

		can.__clearReading();

		return str.substr( start, length );
	});

	can.Mustache.registerHelper('capitalize', function( str, opts ) {
		return can.capitalize( typeof(str) === 'function' ? str() : str );
	});

	can.Mustache.registerHelper('logObj', function( obj, opts ) {
		console.log( obj );
	});

	can.Mustache.registerHelper('stripHtml', function( str, opts ) {
		str = (typeof(str) == 'function') ? str() : str;
		return $('<div>' + str + '</div>').text();
	});

	can.Mustache.registerHelper('applyMore',function () {
		return function (el) {
			$(el).addClass('no-more');
		}
	})

	var imgRenderer = can.view.mustache('<img src="{{ src }}" alt="{{ alt }}" class="{{ klass }}" {{imgErrorHandler}}>');

	var fallbacks = {

	}

	var ImgErrorHandler = can.Control({
		" load" : function(){
			this.destroy(); // cleanup after ourselves
		}, 
		" error" : function(){
			this.element.attr('src', '/assets/images/fallback.png');
			this.destroy();
		}
	})

	can.Mustache.registerHelper('imgErrorHandler', function(fallback){
		return function(el){
			new ImgErrorHandler(el);
		}
	})

	can.Mustache.registerHelper('img', function(src){
		var alt = '', 
			klass = '';

		src = can.isFunction(src) ? src() : src;

		if(arguments.length > 2){
			alt = arguments[1];
			alt = can.isFunction(alt) ? alt() : alt;
		}

		if(arguments.length > 3){
			klass = arguments[2];
			klass = can.isFunction(klass) ? klass() : klass;
		}

		can.__clearReading();

		return !!src ? imgRenderer.render({
			src : src,
			alt : alt,
			klass : klass
			
		}) : "";
	})

	can.Mustache.registerHelper("v", function(compute){
		var val = can.isFunction(compute) ? compute() : compute;
		can.__clearReading();
		return val;
	})

	can.Mustache.registerHelper("when", function(compute, opts){
		var val = can.isFunction(compute) ? compute() : compute;
		can.__clearReading();
		return val ? opts.fn(opts.scope) : opts.inverse(opts.scope);
	})
});
