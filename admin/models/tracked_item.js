steal('can/model', 'can/construct/super', function(Model){
	var TrackedItem = Model.extend({

	}, {
		
	});

	TrackedItem.normalizers = {
		github : function(data){
			var normalize = function(str){
				return TrackedItem.model({name : str, id: str});
			}

			if(data.repos){
				data.repos = can.map(data.repos, normalize);
			}

			if(data.orgs){
				data.orgs = can.map(data.orgs, normalize);
			}

			return data;
		},
		facebook : function(data){
			data.pages = can.map(data.pages, function(page){
				return TrackedItem.model(page);
			})

			return data
		}
	}

	TrackedItem.serializers = {
		github : function(data){
			var serialize = function(obj){
				return obj.id;
			}

			data.repos = can.map(data.repos || [], serialize);
			data.orgs =  can.map(data.orgs || [], serialize);

			return data;
		}
	}

	return TrackedItem;
})