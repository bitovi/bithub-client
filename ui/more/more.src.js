(function(){

	/**
	 * $('.body').more({
	 *   moreHTML: "<a href='javascript://' class='more'>...</a>",
	 *   moreWidth: 50,
	 *   lessHTML: " <a href='javascript://' class='less'>less</a>",
     *   lines: 2
	 * })
	 */
	$.fn.more = function(options){
		// setup defaults
			options = $.extend({
				lessHTML: " <a href='javascript://' class='less'>-</a>",
				moreHTML: " <a href='javascript://' class='more'>+</a>",
				moreWidth: 50,
                lines: 2
			},options||{});
			
	    this.each(function(el){
			var $el = $(this);

			// skip if there is no content
			if ( $el.context.innerText.length == 0 ) {
				return;
			}
			
			// save current HTML for later
			$el.data('originalHTML', $el.html())

			// the active range we will be moving around
			var range = $el.range(),
				// the end of the body's text for comparison
				end = range.clone().collapse(false).start("-1"),
				// the start of the body's text for comparison
				start = nextChar(range.collapse().end("+1"),end).clone(),
				// the current line's first character's coordinates
				prevRect = start.rect(),
				// how many lines we've come across
				lines = 0,
				prevStart;

			// go until we reach the end of the body 
			while(range.compare("START_TO_START",end) != 0){
				range.end("+1").start("+1");
                
				var rect = range.rect();
				// if the charcter is on a new line
				if( rect && (rect.top -prevRect.top  > 4) ) {
					lines++;
					// quit on second line
					if(lines == options.lines){
						break;
					}
					prevStart = range.clone()
					prevRect = rect;
				}
			}
			
			if(lines === options.lines){
				// backup to previous line
				range.end('-1').start('-1');
			}
			
			// get the last visible text element
			prevChar(range, start)
			
			var movedLeft = false,
                offset = $el.offset(),
				width = $el.width();
            
			// keep moving back until there is room for more
			while(range.compare("START_TO_START",start) != -1 ){
				if( range.rect(true).left <= (offset.left+width-options.moreWidth) ) {
					break;
				}
				movedLeft = true;
				range.end("-1").start("-1")
			}
			// exit if we don't need to add more button
			if(!movedLeft && (lines < options.lines ) ) {
				return
			}
			
			var parent = range.start().container;
			// remove remaining text
			if( parent.nodeType === Node.TEXT_NODE ||
			 	parent.nodeType === Node.CDATA_SECTION_NODE ) {
			     parent.nodeValue = parent.nodeValue.slice(0,range.start().offset+1)
			}
			var removeAfter =  parent;
			// remove everything after
			while(removeAfter !== this){
				var parentEl = removeAfter.parentNode,
					childNodes = parentEl.childNodes,
					index = $.inArray(removeAfter,childNodes );
				
				for(var i = parentEl.childNodes.length-1; i > index; i--){
					parentEl.removeChild( childNodes[i] );
				}
				removeAfter = parentEl;
			}
			
	        // add more after parent
	        if( parent.nodeType === Node.TEXT_NODE ||
			 	parent.nodeType === Node.CDATA_SECTION_NODE ) {
			     parent = parent.parentElement
			}
	      	$(parent).append(options.moreHTML);
	      	$el.data('shortenedHTML',$el.html())
                // show more / hide listeners
				.on("click","a.more",function(){
					$el.html($el.data('originalHTML')+options.lessHTML)
				})
				.on("click","a.less",function(){
					$el.html($el.data('shortenedHTML'))
				});
	    })
	};
	
    // Moves the range until it hits something other than a space
	var nextChar = function(range, boundary){
		while(/[\s\n]/.test(range) && range.compare("END_TO_END",boundary) != 1){
			range.start("+1").end("+1")
		}
		return range;
	};
	// Moves the range until it hits something other than a space
	var prevChar = function(range, boundary){
		while(/[\s\n]/.test(range) && range.compare("START_TO_START",boundary) != -1){
			range.start("-1").end("-1")
		}
		return range;
	}
    
})();
