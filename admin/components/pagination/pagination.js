steal(
'can/component',
'./pagination.mustache',
'./pagination.less',
function(Component, initView){
	Component.extend({
		tag : 'admin-pagination',
		template : initView,
		scope : {
			count : 0,
			perPage : 50,
			currentPage : function(){
				var offset = this.attr('params').attr('offset') || 0,
					perPage = this.attr('perPage');

				return offset < perPage ? 1 : Math.ceil(offset / perPage) + 1;
					
			},
			hasPagination : function(){
				return this.attr('count') > this.attr('perPage')
			},
			pages : function(){
				var pages = Math.ceil(this.attr('count') / this.attr('perPage'));

				var res = can.map(Array(pages), function(val, i){
					return i + 1;
				})

				return res;
			}
		},
		helpers : {
			isCurrent : function(page, opts){
				page = can.isFunction(page) ? page() : page;
				return parseInt(page, 10) === this.currentPage() ? opts.fn() : "";
			},
			paginationUrl : function(page, opts){
				var attrs = can.route.attr();

				attrs.currentPage = can.isFunction(page) ? page() : page;

				return can.route.url(attrs);
			}
		}
	})
})