steal('admin/models/brand.js', 'admin/components/admin', 'can/route', function(Brand){

	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		options.data = JSON.stringify(originalOptions.data);
		options.contentType = 'application/json';
	});

	Brand.findOne({}, function(brand){
		window.BRAND = brand;
		var renderer = can.view.mustache('<admin></admin>');

		$('#content').html(renderer({
		  
		}));

		can.route('', {page : 'dashboard'})
		can.route('/:page')

		can.route('/:page/:stage')

		can.route.ready();
	}, function(err){
		window.location.href = '/login';
	})

	


});