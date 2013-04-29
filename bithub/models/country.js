steal(
	'can',
	function (can) {
		var Country = can.Model('Bithub.Models.Country', {
			findAll : 'GET /api/countries'
		}, {});
		
		return Country;
	});
