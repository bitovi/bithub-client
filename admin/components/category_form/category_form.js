steal(
'can/util/string',
'can/component',
'./category_form.mustache',
'admin/models/tag_tree.js',
'admin/models/tag.js',
'./category_form.less',
'admin/components/multiselect',
function(can, Component, categoryFormView, TagTreeModel, TagModel){

	return can.Component({
		tag : 'category-form',
		template : categoryFormView,
		scope : {
			isSaving : false,
			loading : true,
			init : function(){
				var self = this;

				this.attr('feeds', new can.List);
				this.attr('keywords', new can.List);

				$.when(TagModel.findAll({
					order : ['name', 'ASC']
				}), TagTreeModel.findAll()).then(function(tags, data){
					can.batch.start();
					self.attr('feeds').replace(data[0].feeds);
					self.attr('keywords').replace(tags);
					self.attr('loading', false);
					self.prepareCategoryTags();
					can.batch.stop();
				})
			},
			prepareCategoryTags : function(){;
				var category = this.attr('category'),
					tags = category.attr('tags'),
					keywords = this.attr('keywords'),
					tagsArr = tags.attr();

				keywords.attr('length');
				tags.attr('length');

				this.attr('category.tags', can.grep(keywords, function(keyword){
					return can.inArray(keyword.attr('name'), tagsArr) > -1;
				}));
			},
			addConstraint : function(){
				this.attr('category').addConstraint();
			},
			removeConstraint : function(constraint){
				this.attr('category').removeConstraint(constraint);
			},
			saveCategory : function(){
				var self = this;
				this.attr('isSaving', true);
				this.attr('category').save(function(){
					self.attr('isSaving', false);
					self.attr('doneEditing', true);
				});
			},
			cancelEditing : function(){
				this.attr('doneEditing', true);
			}
		},
		helpers : {
			availableTypes : function(opts){
				var context = opts.context,
					feedName = context.attr('feed_name'),
					feeds = this.attr('feeds'),
					feed;

				if(feedName !== ""){
					feed = can.grep(this.attr('feeds'), function(f){
						return f.attr('name') === feedName;
					})[0];

					if(feed){
						return can.map(feed.attr('types'), function(type){
							return opts.fn(opts.contexts.add(type));
						}).join('');
					}
				}

				return "";
			}
		},
		events : {
			"{scope.category.constraints} change" : function(constraints, ev, attr, how, newVal, oldVal){
				if(how === "set" && attr.split('.').pop() === "feed_name"){
					this.scope.attr('category.constraints.' + (attr.replace(/feed/, 'type')), "");
				}
				
			}
		}
	})

});