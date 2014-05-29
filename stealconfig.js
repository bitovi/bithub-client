steal.config({
	map: {
		"jquery/jquery" : "jquery",
		"can/util/util": "can/util/jquery/jquery",
		"bootstrap/bootstrap" : "bootstrap",
		"bootstrap-datepicker/bootstrap-datepicker": "bootstrap-datepicker",
		"fileupload-load-image/fileupload-load-image" : 'fileupload-load-image',
		'jquery-widget/jquery-widget' : 'jquery-widget',
		'fileupload/fileupload' : 'fileupload',
		'fileupload-processing/fileupload-processing' : 'fileupload-processing',
		'more/more' : 'more',
	},
	paths: {
		"can": "can/can.js",
		"jquery": "can/lib/jquery.1.9.1.js",
		"bootstrap" : "vendor/bootstrap/bootstrap.src.js",
		"bootstrap-datepicker": "vendor/bootstrap-datepicker/bootstrap-datepicker.src.js",
		"fileupload-load-image" : 'vendor/fileupload/load-image.js',
		'jquery-widget' : 'vendor/fileupload/jquery.ui.widget.js',
		'fileupload' : 'vendor/fileupload/fileupload.src.js',
		'fileupload-processing' : 'vendor/fileupload/fileupload-fp.src.js',
		'more' : 'ui/more/more.js',

	},
	meta : {
		jquery: {
			exports: "jQuery"
		},
		bootstrap: {
			deps: ['jquery']
		},
		"bootstrap-datepicker" : {
			deps : ['jquery', 'vendor/bootstrap-datepicker.less!']
		},
		"fileupload-load-image" : {
			deps :['jquery']
		},
		"jquery-widget" : {
			deps : ["fileupload-load-image"]
		},
		"fileupload" : {
			deps : ["jquery-widget"]
		},
		"fileupload-processing" : {
			deps : ['fileupload']
		},
		"more" : {
			deps : ["jquery", 'jquerypp/dom/range/range.js']
		}
	},
	ext: {
		ejs: "can/view/ejs/systemjs.js",
		mustache: "can/view/mustache/systemjs.js"
	}
});

System.buildConfig = {
	map: {"can/util/util" : "can/util/domless/domless"}
};