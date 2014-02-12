steal(
	'can',
	function (can) {
		var Activity = can.Model.extend('Bithub.Models.Activity', {
			findAll : 'GET /api/v1/users/{userId}/activities'
		}, {});
		
		return Activity;
	});
