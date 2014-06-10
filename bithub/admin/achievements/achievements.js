steal('can',
	'./init.mustache',
	'bithub/models/achievement.js',
	'vendor/bootstrap-datepicker',
	'vendor/moment',
	'can/map/attributes',
	'can/map/setter',
	function(can, initView, Achievement, Datepicker){

		var PaginationMap = can.Map.extend({
			attributes : {
				offset : function(val){
					return parseInt(val, 10);
				},
				limit : function(val){
					return parseInt(val, 10);
				}
			}
		}, {
			setOffset : function(val){
				return parseInt(val, 10);
			},
			setLimit : function(val){
				return parseInt(val, 10);
			},
			serialize : function(){
				var data = this._super(),
					filter = data.filter;

				delete data.filter;

				if(filter === 'achieved-complete'){
					data.shipped_at = '*null';
					data.profile_completed = true;
				} else if(filter === 'achieved-incomplete'){
					data.shipped_at = '*null';
					data.profile_not_completed = true;
				} else if(filter === 'shipped'){
					data.shipped_at = '*notnull';
				}

				console.log(data)

				return data;
			}
		})


		return can.Control.extend({
			defaults : {
				achievements: new can.Observe.List()
			}
		}, {
			init : function( elem, opts ){
				var self = this,
					achievements = this.options.achievements,
					routeParams = can.route.attr('achievementsFilter') || {};

				this.count = can.compute(0);

				this.options.params = new PaginationMap({
					offset : routeParams.offset || 0,
					limit : routeParams.limit || 30,
					filter : routeParams.filter || "achieved-complete"
				});

				this.loading = can.compute(false);

				this.on();

				this.element.html(initView({
					achievements: achievements,
					hasPagination : function(){
						var count  = self.count(),
							limit = self.options.params.attr('limit');

						return count >  limit;
					},
					loading : this.loading,
					pages : function(){
						var count  = self.count(),
							limit  = self.options.params.attr('limit'),
							i      = 0;

						return can.map(new Array(Math.ceil(count / limit)), function(){
							return ++i;
						});
					}
				}, {
					datepicker: function(){
						return function( el ){
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

						var filter = self.options.params.attr();

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
						filter = self.options.params.attr();

						if(filterName === filter.filter){
							return opts.fn();
						}
					}
				}));

				this.reqData();
			},

			reqData : function(){
				var params = this.options.params.serialize(),
					self = this;

				can.route.attr('achievementsFilter', this.options.params.attr());
				
				clearTimeout(this.__reqTimeout);
				this.__reqTimeout = setTimeout(function(){
					self.loading(true);
					Achievement.findAll(params, function( data ) {
						self.count(data.count);
						self.loading(false);
						self.options.achievements.replace( data );
					});
				}, 1)
			},

			'{can.route} achievementsFilter change' : function(achievementsFilter){
				this.options.params.attr(achievementsFilter.attr());
			},

			'{params} change' : 'reqData',

			'.btn.save click': function( el, ev ) {
				ev.preventDefault();

				var achievement = el.closest('tr').data('achievement'),
				shipped_at = el.closest('tr').find('input[name=shipped_at]').val();

				achievement.attr('shipped_at', shipped_at && moment(shipped_at).format() );
				achievement.save(function() {
					el.removeClass('btn-primary').addClass('btn-success');
					setTimeout(function() { el.removeClass('btn-success').addClass('btn-primary')}, 3000);
				}, function() {
					el.removeClass('btn-primary').addClass('btn-danger');
					setTimeout(function() { el.removeClass('btn-danger').addClass('btn-primary')}, 3000);
				});
			}
		});
});
