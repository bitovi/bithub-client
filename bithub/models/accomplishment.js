steal(
	'can',
	'can/list',
	'vendor/moment',
	function (can) {
		
		var Model = can.Model('Bithub.Models.Accomplishment', {

			findAll : 'GET /api/v1/users/{userId}/accomplishments',

		}, {});

		Model.List = Model.List.extend({}, {
			filterActivities: function( condFn, pluckProp ) {
				var filtered =  _.filter( this, condFn );
				return pluckProp ? _.pluck( filtered, pluckProp ) : filtered;
			},

			watchedRepos: function() {
				return can.map(can.grep(this || [], function(activity){
					var title = activity.attr('title');
					return title && title.indexOf('started watching bitovi/') == 0
				}), function(activity){
					return activity.attr('title').match(/.*bitovi\/(.*).*/i)[1]
				});
			},

			followedAccounts: function() {
				var followes = this.filterActivities( function( activity ) {
					if( activity.attr('title') && activity.attr('title').indexOf('followed @') == 0 )
						return activity;
				}, 'title');

				return _.map(followes, function( account ) {
					return account.split('@')[1];
				});
			}
		})
		
		return Model;
	});
