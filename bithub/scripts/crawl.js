// load('bithub/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("bithub/bithub.html","bithub/out")
});
