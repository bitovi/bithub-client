steal(
'can/component', 
'./achievements.mustache',
'admin/models/achievement.js',
'./achievements.less',
function(Component, initView, AchievementModel){

	var prepareFilter = function(data){

		var filter = data.filter;

		delete data.filter;

		/*if(filter === 'achieved-complete'){
			data.shipped_at = '*null';
			data.profile_completed = true;
		} else if(filter === 'achieved-incomplete'){
			data.shipped_at = '*null';
			data.profile_not_completed = true;
		} else if(filter === 'shipped'){
			data.shipped_at = '*notnull';
		}*/

		return data;
			
	}

	Component.extend({
		tag : 'achievements',
		template : initView,
		scope : {
			params : {},
			achievements : [],
			count : 0,
			init : function(){
				var params = can.route.attr('achievementsFilter');
			
				this.attr('params', params ? params.serialize() : {filter : 'achieved-complete'});
				this.updateParams();
				this.loadAchievements();
			},
			loadAchievements : function(){
				var self = this,
					def = AchievementModel.findAll(prepareFilter(this.attr('params').serialize()));

				this.attr('loading', true);

				def.then(function(achievements){

					can.batch.start();
					self.attr('achievements').replace(achievements);
					self.attr('loading', false);
					self.attr('count', achievements.count);
					can.batch.stop();
				})
			},
			hasPagination : function(){
				var count = this.attr('count'),
					limit = this.attr('params.limit');

				return count >  limit;
			},
			loading : false,
			pages : function(){
				var count  = this.attr('count'),
					limit  = this.attr('params.limit'),
					i      = 0;

				return can.map(new Array(Math.ceil(count / limit)), function(){
					return ++i;
				});
			},
			updateParams : function(){
				var params = this.attr('params').serialize(),
					currentPage = can.route.attr('currentPage') || 1;

				params.offset = (currentPage - 1) * 50;

				this.attr('params', params);
				can.route.attr('achievementsFilter', params);
			}
		},
		helpers : {
			datepicker: function(){
				return function( el ){
					return
					$(el).datepicker({
						format: 'yyyy-mm-dd',
						weekStart: 0
					});
				}
			},
			formatTs: function( ts ) {
				ts = typeof(ts) === 'function' ? ts() : ts;
				return ts ? moment(ts).format('YYYY-MM-DD') : '';
			},
			pageUrl : function(page){
				page = can.isFunction(page) ? page() : page;

				var filter = self.options.params.attr();

				filter.offset = (page - 1) * filter.limit;

				return can.route.url({
					achievementsFilter : filter
				}, true)
			},
			filterUrl : function(filterName){
				filterName = can.isFunction(filterName) ? filterName() : filterName;

				var filter = this.params.attr();

				filter.filter = filterName;
				filter.offset = 0;

				return can.route.url({
					achievementsFilter : filter
				}, true);
			},
			isActivePage : function(page, opts){
				var filter;

					page = can.isFunction(page) ? page() : page;
					filter = self.options.params.attr();

					if(page - 1 == filter.offset / filter.limit){
						return opts.fn();
					}
			},
			isCurrentFilter : function(filterName, opts){
				var filter;

				filterName = can.isFunction(filterName) ? filterName() : filterName;
				filter = this.attr('params').attr();

				if(filterName === filter.filter){
					return opts.fn();
				}
			}
		},
		events : {
			"{can.route} currentPage" : function(){
				this.scope.updateParams();
			},
			"{can.route} achievementsFilter change" : function(){
				var params = can.route.attr('achievementsFilter');
				this.scope.attr('params', params ? params.serialize() : {});
				this.scope.loadAchievements()
			}
		}
	})
})