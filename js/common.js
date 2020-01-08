jQuery(document).ready(function(e) {
	
	var mainHeader = $(".gHideHeader"),
		secondaryNavigation = $(".subMenuLBg"),
		//this applies only if secondary nav is below intro section
		belowNavHeroContent = $(".sub-nav-hero"),
		headerHeight = mainHeader.height();
	
	//set scrolling variables
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 150;

	mainHeader.on("click", ".nav-trigger", function(event){
		// open primary navigation on mobile
		event.preventDefault();
		mainHeader.toggleClass("nav-open");
	});

	$(window).on("scroll", function(){
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(autoHideHeader, 250)
				: requestAnimationFrame(autoHideHeader);
		}
	});

	$(window).on("resize", function(){
		headerHeight = mainHeader.height();
	});

	function autoHideHeader() {
		var currentTop = $(window).scrollTop();

		( belowNavHeroContent.length > 0 ) 
			? checkStickyNavigation(currentTop) // secondary navigation below intro
			: checkSimpleNavigation(currentTop);

	   	previousTop = currentTop;
		scrolling = false;
	}

	function checkSimpleNavigation(currentTop) {
		//there"s no secondary nav or secondary nav is below primary nav
		if (previousTop - currentTop > scrollDelta) {
			//if scrolling up...
			mainHeader.removeClass("is-hidden");
		} else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
			//if scrolling down...
			mainHeader.addClass("is-hidden");
		}
	}

	function checkStickyNavigation(currentTop) {
		//secondary nav below intro section - sticky secondary nav
		var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();
		
		if (previousTop >= currentTop ) {
			//if scrolling up... 
			if( currentTop < secondaryNavOffsetTop ) {
				//secondary nav is not fixed
				mainHeader.removeClass("is-hidden");
				secondaryNavigation.removeClass("fixed slide-up");
				belowNavHeroContent.removeClass("secondary-nav-fixed");
			} else if( previousTop - currentTop > scrollDelta ) {
				//secondary nav is fixed
				mainHeader.removeClass("is-hidden");
				secondaryNavigation.removeClass("slide-up").addClass("fixed"); 
				belowNavHeroContent.addClass("secondary-nav-fixed");
			}
			
		} else {
			//if scrolling down...	
			if( currentTop > secondaryNavOffsetTop + scrollOffset ) {
				//hide primary nav
				mainHeader.addClass("is-hidden");
				secondaryNavigation.addClass("fixed slide-up");
				belowNavHeroContent.addClass("secondary-nav-fixed");
			} else if( currentTop > secondaryNavOffsetTop ) {
				//once the secondary nav is fixed, do not hide primary nav if you haven"t scrolled more than scrollOffset 
				mainHeader.removeClass("is-hidden");
				secondaryNavigation.addClass("fixed").removeClass("slide-up");
				belowNavHeroContent.addClass("secondary-nav-fixed");
			}
		}
	}
	
	// 文字欄位內的提示文字
	_hint = jQuery(".gBotMenuR").find("form").bind("submit", function() {
		/* 觸發清除訊息事件 */
		jQuery(this).find("input[title]").trigger("clear");
	}).end().delegate('input[title]', 'clear', function() {
		/* 清除預設訊息 */
		if (this.value == this.title && !jQuery(this).is(".pwd")) this.value = '';
	}).delegate("input[title]", "focus", function() {
		/* 觸發焦點事件 */
		var input = jQuery(this);
		if (input.is(".pwd"))
		{
			if (this.type == "text")
			{
				/* 密碼欄位 */
				var tmp = input.hide().prev().show();
		 
				/* For 笨 IE 延遲觸發焦點*/
				setTimeout(function() {
					tmp.trigger("focus");
				}, 5);
			}
		}
		else input.trigger("clear");
	}).delegate("input[title]", "blur", function() {
		/* 觸發離開事件 */
		if (this.value == '' || this.value == this.title)
		{
			if (this.type == "password") jQuery(this).hide().next().show();
			else this.value = this.title;
		}
	}).delegate("input[title]", "init", function() {
		if (this.type == "password") jQuery(this).parent().append('<input type="text" value="' +this.title+ '" title="" class="' +this.className+ '" />');
	}).find("input").trigger("init").trigger("blur");

});