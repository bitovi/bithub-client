steal('can/util/string', './tracked_item.js', 'can/model', 'can/construct/super', function(can, TrackedItem){

	return can.Model({

		findAll : 'GET /api/v2/feed_configs',
		findOne : 'GET /api/v2/feed_configs/{id}',
		create  : 'POST /api/v2/feed_configs',
		update  : 'PUT /api/v2/feed_configs/{id}',
		destroy : 'DELETE /api/v2/feed_configs/{id}',
		model : function(data){
			var provider = data.feed_name;

			if(TrackedItem.normalizers[provider]){
				data.config = TrackedItem.normalizers[provider](data.config);
			}

			return this._super(data);
		}

	}, {
		init : function(){
			var provider = this.attr('feed_name');

			can.batch.start();

			if(!this.attr('config') || this.attr('config') === null){
				this.attr('config', {});
			}

			if(provider === 'github'){
				this.attr('config.repos', this.attr('config.repos') || []);
				this.attr('config.orgs', this.attr('config.orgs') || []);
			}

			if(provider === 'facebook'){
				this.attr('config.pages', this.attr('config.pages') || []);
			}

			if(provider === 'disqus'){
				this.attr('config.forums', this.attr('config.forums') || []);
			}

			if(provider === 'meetup'){
				this.attr('config.groups', this.attr('config.groups') || []);
				this.attr('config.terms', this.attr('config.terms') || []);
			}

			if(provider === 'twitter'){
				this.attr('config.terms', this.attr('config.terms') || []);
			}

			if(provider === 'stackexchange'){
				this.attr('config.tags', this.attr('config.tags') || []);
			}

			can.batch.stop();
		},
		serialize : function(){
			var data = this._super();

			if(TrackedItem.serializers[data.feed_name]){
				data = TrackedItem.serializers[data.feed_name](data);
			}

			return {
				feed_config : data
			}
		}
	});

})