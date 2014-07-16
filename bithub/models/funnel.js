steal('can',
		function (can) {
			return can.Model('Bithub.Models.Funnel', {

				// CRUD
				findAll : 'GET /api/v2/funnels',
				findOne : 'GET /api/v2/funnels/{id}',
				create  : 'POST /api/v2/funnels',
				update  : 'PUT /api/v2/funnels/{id}',
				destroy : 'DELETE /api/v2/funnels/{id}'

			}, {

				score : function(entity){
					var score = 0,
						constraints = this.attr('constraints'),
						tags = this.attr('tags').attr(),
						entityTags = entity.attr('tags').attr(),
						feed = entity.attr('feed'),
						type = entity.attr('type'),
						constraint;

					score = _.intersection(tags, entityTags).length;

					for(var i = 0; i < constraints.length; i++){
						constraint = constraints[i]
						if(feed === constraint.feed_name && type === constraint.type_name){
							score += 10;
						}
					}
					
					return score
				}
			});
		});
