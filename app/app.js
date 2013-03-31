// Load all of the plugin dependencies
steal(
	//'./styles.css',
	'app/events',
	function(Events){
		
		// Create the state that will be shared by everything
		var currentState = can.compute();

		// Init Controllers
		new Events('#events');
		
		// 
		console.log("BitHub client loaded!");
	});


