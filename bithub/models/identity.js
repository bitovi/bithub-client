steal(
	'can',
	function (can) {
		var Identity = can.Model('Bithub.Models.Identity', {
			destroy : "DELETE /api/auth/unlink_identity/{uid}"
		}, {
			identifier : function(){
				var sd = this.attr('source_data');
				return sd.nickname || sd.name || sd.email;
			}
		});
		
		return Identity;
	});
