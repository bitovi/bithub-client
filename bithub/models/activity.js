steal(
	'can',
	function (can) {
		var Activity = can.Model.extend('Bithub.Models.Activity', {
			findAll : 'GET /api/users/{userId}/activities'
		}, {});
		
		return Activity;
	});
