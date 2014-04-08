var sprintf  = require('sprintf').sprintf,
    fs       = require('fs'),
    exec     = require('child_process').exec,
    less     = require('less'),
    _        = require('lodash'),
    Compiler = require('./compiler').Compiler,
    S        = require('string'),
    esprima   = require('esprima'),
    fs        = require('fs'),
    escodegen = require('escodegen');



var getRenderer = function(ext, cwd){
  return "define(function() {\n"+
    " var Rndrr = {},\n"+
    "   buildMap = {};\n"+
    " Rndrr.load = function(name, parentRequire, load, config) {\n"+
    "   var path = parentRequire.toUrl(name + '." + ext + "'),\n"+
    "     fs, views, output;\n"+
    "   if(config.isBuild){\n"+
    "     path   = path.replace(/\\.|\\//g, '_').replace(/^_+|_+$/g, '');\n"+
    "     fs     = require.nodeRequire('fs'),\n"+
    "     views  = JSON.parse(fs.readFileSync('" + cwd + "/.build/views.json')),\n"+
    "     output = 'define([\\'can/view/" + ext + "\\', \\'can/observe\\'], function(can){ return ' + views[path] + ' });'\n"+
    "     buildMap[name] = output;\n"+
    "     load(output);\n"+
    "   } else {\n"+
    "     parentRequire(['can/view/" + ext + "', 'can/observe'], function(can) {\n"+
    "       load(function(data, helpers){\n"+
    "         return can.view(path, data, helpers)\n"+
    "       });\n"+
    "     });\n"+
    "   }\n"+
    " };\n"+
    " Rndrr.write = function (pluginName, name, write) {\n"+
    "   if (buildMap.hasOwnProperty(name)) {\n"+
    "     var text = buildMap[name];\n"+
    "     write.asModule(pluginName + '!' + name, text);\n"+
    "   }\n"+
    " };\n"+
    " return Rndrr;\n"+
    "});";
}

/**
 * This Gruntfile provides a `build` task that enables you to combine your
 * EJS and mustache views in the production build.
 *
 * The problem is that r.js is completely synchronous and can-compile uses
 * JSDom library which is async. That's why this build system is complicated
 * and kinda brittle. It should be only a temporary solution.
 *
 * Build system works like this:
 *
 * 1. Create temp .build folder
 * 2. call can-compile and create .build/views.js file
 * 3. Use esprima and escodegen to parse .build/views.js and convert it to a JSON file
 * 4. Provide custom renderers for mustache and EJS that will get compiled view from the JSON file
 * 5. Call require compile task to create production.js file
 * 6. Remove .build folder to cleanup
 */

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    
    watch: {
      less : {
        files: '**/*.less',
        tasks: ['less'],
        options: {
          livereload : true
        }
      },
      borderImagges : {
        files: '**/*.less',
        tasks : ['autoGenerateBorders']
      }
    },
    less: {
      development: {
        files: {
          "styles/mockup/mockup.css": "styles/mockup/mockup.less"
        }
      }
    },
    exec : {
      mkbuilddir : {
        cmd : 'mkdir .build'
      },
      rmbuilddir   : {
        cmd : 'rm -rf .build'
      },
      compileviews : {
        cmd: 'node_modules/can-compile/bin/can-compile -o .build/views.js'
      }
    },
    requirejs : {
      compile : {
        options : {
          paths: {
            can      : 'bower_components/canjs/amd/can',
            jquery   : 'bower_components/jquery/jquery',
            mustache : '.build/mustache',
            ejs      : '.build/ejs'
          },
          name : 'bithub_mockups',
          out : 'production.js'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: '.'
        }
      }
    },
    shell: {                                // Task
      generateBorder: {                      // Target
        options: {                      // Options
          stdout: true,
          execOptions : {
            cwd: 'styles/mockup/images'
          }
          
        },
        command: function(){
          var bg = grunt.option('bg'),
              fg = grunt.option('fg'),
              timestamp = '_' + (new Date).getTime() + '_',
              bgFilename = timestamp + 'bg',
              fgFilename = timestamp + 'fg',
              generatorTemplate = "convert -size 996x996 xc:'%s' %s.png",
              convertTemplate = "convert %s.png _border-%s.png -alpha Off -compose Copy_Opacity -composite %s.png",
              bgFilenamePart = (bg || '_').replace(/^#/, ''),
              fgFilenamePart = (fg || '_').replace(/^#/, ''),
              filename = ['border', bgFilenamePart, fgFilenamePart].join('-'),
              commands = [];

          if(!fg && !bg){
            throw grunt.util.error('You must provide either the --fg or the --bg option.')
          }

          if(bg){
            commands.push(sprintf(generatorTemplate, bg, bgFilename));
            commands.push(sprintf(convertTemplate, bgFilename, 'background', bgFilename));
          }

          if(fg){
            commands.push(sprintf(generatorTemplate, fg, fgFilename));
            commands.push(sprintf(convertTemplate, fgFilename, 'foreground', fgFilename));
          }

          if(fg && bg){
            commands.push(sprintf("composite %s.png %s.png  %s.png ", fgFilename, bgFilename, filename));
          } else {
            commands.push(sprintf("cp %s.png %s.png ", (bgFilename || fgFilename), filename));
          }

          fg && commands.push(sprintf("rm %s.png", fgFilename));
          bg && commands.push(sprintf("rm %s.png", bgFilename));

          return commands.join(' && ');
        }
      }
    }

  });

  grunt.registerTask('autoGenerateBorders', function(){
    var done = this.async();
    exec('grep "\\.border-image" styles/**/*.less', function(error, stdout, stderr){
      var matches = _.uniq(_.map(stdout.replace(/\s*$/, '').split('\n'), function(row){
        return row.substr(row.indexOf(':') + 1).replace(/;|\{\s*/, '').replace(/^\s*/, '') + ';';
      }))

      var parser = new less.Parser;

      var commands = []

      _.map(matches, function(match){
        parser.parse(match, function (e, tree) {
          var argsObj = {
            fg : '_',
            bg : '_'
          };

          var args = _.map(tree.rules[0].arguments, function(arg){
            var name = arg.name.replace(/^@/, ""),
                value = arg.value.value[0].value,
                isHex = (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).test('#' + value);

            argsObj[name] = value;

            value = isHex ? '\\#' + value : value
            
            return sprintf('--%s=%s', name, value);
          });

          var filename = sprintf('%s/styles/mockup/images/border-%s-%s.png', __dirname, argsObj.bg, argsObj.fg);

          if(!fs.existsSync(filename) && (argsObj.fg !== '_' || argsObj.bg !== '_')){
            commands.push('grunt shell:generateBorder ' + args.join(' '));
          }

        });
      })

      exec(commands.join(' && '), function(err){
        if(err){
          console.error(err)
        }
        done();
      })
    })
  })

  grunt.registerTask('screenshots', function(){
    var done = this.async();
    exec('rm demo/screenshots/*.png && cd components && ls -d *', function(error, stdout, stderr){
      var folders = S(stdout).trim().lines(),
          counter = 0;

      _.each(folders, function(folder){
        counter++;
        console.log('FOLDER', folder)
        exec(sprintf('casperjs ~/Projects/bithub-mockups/demo/screenshot.js %s --engine=slimerjs', folder), function(error, stdout, stderr){

          if(stderr){
            console.log('ERROR', stderr);
          } else {
            console.log('STDOUT', stdout);
          }
          
          counter--;
          if(counter === 0){
            done();
          }
        });
      })
      
    })
  })

  grunt.registerTask('extractViews', function(){
    var file           = fs.readFileSync('.build/views.js'),
      ast            = esprima.parse(file),
      views          = ast.body[0].expression.callee.body.body,
      generatedViews = {};

    views.forEach(function(view){
      var filename = view.expression.arguments[0].value;
      generatedViews[filename] = escodegen.generate(view);

    })
    fs.writeFileSync('.build/views.json', JSON.stringify(generatedViews));
  })

  grunt.registerTask('createRenderers', function(){
    fs.writeFileSync('.build/mustache.js', getRenderer('mustache', process.cwd()));
    fs.writeFileSync('.build/ejs.js', getRenderer('ejs', process.cwd()));
  })

  grunt.registerTask('build', function(){
    grunt.task.run(
      'exec:rmbuilddir',
      'exec:mkbuilddir',
      'exec:compileviews',
      'extractViews',
      'createRenderers',
      'requirejs:compile',
      'exec:rmbuilddir'
    );
  });
  


  grunt.registerTask('server', ['connect:server:keepalive']);
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell');

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.

};