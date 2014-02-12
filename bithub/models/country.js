steal(
	'can',
	function (can) {
		var Country = can.Model('Bithub.Models.Country', {
			findAll : 'GET /api/v1/countries'
		}, {});
		
		return Country;
	});
