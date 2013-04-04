// load('bithub2/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("bithub2/bithub2.html","bithub2/out")
});
