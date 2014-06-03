var stealTools = require('steal-tools');

stealTools.build({
  config: __dirname + "/stealconfig.js",
  main: "bithub/bithub"
}).then(function(){
  console.log("build is successful")
})