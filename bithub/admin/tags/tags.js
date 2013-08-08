steal(
	'can',
	'bithub/models/tag.js',
	'./tags.ejs',
	'bithub/admin/tags/form',
	'../paginator.js',
	function(can, Tag, tagsListView, tagFormControl, Paginator) {
		
		var isFormAction = function (route) {
			return route==='edit' || route==='new';
		}
		
		var paginator;
		return can.Control.extend({
			pluginName: 'admin-tags',
			defaults : { 'Tag': Tag } 
		}, {
			init : function(element, opts){
				paginator = new Paginator(can.route.attr('offset'));
				if (isFormAction(can.route.attr('action'))) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},
			
			loadForm: function () {
				var self = this;
				if (can.route.attr('id')) {
					Tag.findOne({id: can.route.attr('id')}, function(tag) {
						new tagFormControl(self.element, {tag: tag});
					});
				} else  {
					new tagFormControl(self.element, {tag: new Tag()});
				}
			},
			
			loadList: function () {
				var self = this;
				Tag.findAll(paginator.currentState(), function(tags) {
					self.element.html(tagsListView({
						tags: tags,
						prevOffset: paginator.prevOffset(),
						nextOffset: paginator.nextOffset()
					}));
				});
			},

			'{can.route} offset': function(j, d, newVal, oldVal) {
				paginator.updateOffset(newVal);
				this.loadList();
			},
			
			'{can.route} action': function (route, ev, newVal, oldVal) {
				if (isFormAction(newVal)) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},
			
			'td .delete-tag click' : function (el, ev) {
				if (confirm("Are you sure?"))
					el.closest('tr').data('tag').destroy();
			},

			'{Tag} destroyed' : function (Tag, ev, eventDestroyed) {
			}

		});
	}
);
