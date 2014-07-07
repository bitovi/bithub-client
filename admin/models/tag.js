steal('can/util/string', 'can/model', 'can/construct/super', function(can){

	var formatName = function(name){
		name = can.camelize(name.replace(/_/g, '-'));
		name = name.substr(0, 1).toUpperCase() + name.substr(1);
		return name;
	}

	return can.Model({

		findAll : 'GET /api/v2/tags',
		models : function(data){
			var tags = data.data.sort(function(a, b){
				var aName = a.display_name || a.name,
					bName = b.display_name || b.name;

				if(aName < bName) return -1;
				if(aName > bName) return 1;
				return 0;
			});

			return this._super(tags)
		}
	}, {
		displayName : function(){
			return formatName(this.attr('display_name') || this.attr('name') || "");
		}
	});

})