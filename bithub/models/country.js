steal(
	'can',
	function (can) {
		var Country = can.Model('Bithub.Models.Country', {
			findAll : 'GET /api/v2/countries'
		}, {});
		
		return Country;
	});
