steal('admin/components/admin', 'can/route', function(){


	var renderer = can.view.mustache('<admin></admin>');

	$('#content').html(renderer({
	  
	}));

	can.route('', {page : 'dashboard'})
	can.route('/:page')

	can.route('/:page/:stage')

	can.route.ready();


});