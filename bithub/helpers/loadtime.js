steal(
	'jquery',
	function () {

		return function( opts ) {
			var count = 0,
				startTs = window.START_TIME || new Date(),
				verbose = (opts && opts.verbose) || false;
			
			$(document)
				.ajaxSend( function ( event, xhr, opts ) {
					count++;
					verbose && console.log("Ajax SEND; " + opts.url + "; COUNT = " + count);
				})
				.ajaxComplete( function ( event, xhr, opts ) {
					if (--count === 0) {
						$('#statusbar').html('<small>' + ((new Date() - startTs) / 1000) + '</small>');
					};
					verbose && console.log("Ajax COMPLETE; " + opts.url + "; COUNT = " + count);
				});
		};
	});


