
var toTopJS = 	{
	vrs: {
		scrollTopEle: '#totop',
		isScrolling: false
	},
	ltr: {
		toTopHandler: function(e) {
			e.preventDefault();
            $( 'html, body' ).animate( {
                scrollTop: 0
            }, 700 );
		},
		scrollingHandler: function(e) {
			var $scrollTopEle = $(toTopJS.vrs.scrollTopEle);
			if ( $( window ).scrollTop()  >  $( window ).height() / 2 ) {
				$scrollTopEle.addClass('show');
			} else {
				$scrollTopEle.removeClass('show');
			}
		}
	},
	cfn: {
		init: function() {
			$(toTopJS.vrs.scrollTopEle).bind('click', toTopJS.ltr.toTopHandler);
			$(window).on('scroll', toTopJS.ltr.scrollingHandler);
		}
	}
};

var homeBannerJS = {
	vrs: {
		id: '#top_banner'
	},
	ltr: {
		setNextSlideHander: function() {
			$(homeBannerJS.vrs.id+' .camera_pag .camera_pag_ul li').removeClass('cameranext');
			var currentIndex = parseFloat($(homeBannerJS.vrs.id+' div.cameraSlide.cameracurrent').index());

			var nextSlide = $(homeBannerJS.vrs.id+' .camera_pag .camera_pag_ul li').get(currentIndex+1);

			if (typeof nextSlide == 'undefined') {
				nextSlide = $(homeBannerJS.vrs.id+' .camera_pag .camera_pag_ul li').get(0);
			}
			$(nextSlide).addClass('cameranext');
		},
		bgImageHandler: function(){
			if (!$(homeBannerJS.vrs.id).hasClass('bg-image-loaded')) {
				$(homeBannerJS.vrs.id+' .camera_src > div').each(function(index, obj){
					var $obj = $(this);
					var src = $obj.attr('data-image');
					var bg_color = $obj.attr('data-bg-color');

					var bg = $(homeBannerJS.vrs.id+' .cameraContents .cameraContent').get(index);
					if (bg !== undefined) {
						if (bg_color !== undefined && bg_color.length > 0){
							$(bg).css('background-color', bg_color);
						} else {
							$(bg).css('background-image', 'url(' + src + ')');
						}
					}
				});

				$(homeBannerJS.vrs.id).addClass('bg-image-loaded');
			}
			$(homeBannerJS.vrs.id+' .cameraContent.cameracurrent').fadeIn(1000);
			homeBannerJS.ltr.setNextSlideHander();
		},
		fullWidthBannerHandler: function () {
			if ($(homeBannerJS.vrs.id).find('.camera-control-container').length==0) {
				$(homeBannerJS.vrs.id).find('.camera_prev').after('<div class="camera-control-container"></div>')
				$(homeBannerJS.vrs.id).find('.camera-control-container').append($($(homeBannerJS.vrs.id).find('.camera_prev, .camera_next')));
			}
		}
	},
	cfn: {
		init: function() {
			if ($(homeBannerJS.vrs.id).length >0) {
				$(homeBannerJS.vrs.id).camera({
					alignment: 'centerLeft',
					loader: 'pie',
					time: 3500,
					height: '426px',
					playPause: false,
					transPeriod: 500,
					fx: 'simpleFade',
					loader: 'none',
					onEndTransition: homeBannerJS.ltr.bgImageHandler,
					onLoaded: homeBannerJS.ltr.fullWidthBannerHandler,
				});
			}
		}
	}
}

var videoSliderJS = {
	vrs: {
		id: '#latest_video_slider'
	},
	ltr: {
		videoIconHandler: function() {
			$(".latest-video-slider-container .video-category-icon").fadeOut(400);
		},
		bgImageHandler: function(){
			if (!$(videoSliderJS.vrs.id).hasClass('bg-image-loaded')) {
				$(videoSliderJS.vrs.id+' .camera_src > div').each(function(index, obj){
					var $obj = $(this);
					var src = $obj.attr('data-image');
					var bg = $(videoSliderJS.vrs.id+' .cameraContents .cameraContent').get(index);
					if (bg !== undefined) {
						$(bg).css('background-image', 'url(' + src + ')');
					}
				});

				$(videoSliderJS.vrs.id).addClass('bg-image-loaded');
			}
			$(videoSliderJS.vrs.id+' .cameraContent.cameracurrent').fadeIn(1000);
			var id = $(videoSliderJS.vrs.id+' .cameraContent.cameracurrent .camera-slider-content-container:first-child').attr('data-id');
			if (typeof id !== 'undefined') {
				var $icon = $(".latest-video-slider-container .video-category-icon[data-id='"+id+"']");
				$icon.fadeIn(1000);
			}
		}
	},
	cfn: {
		init: function() {
			if ($(videoSliderJS.vrs.id).length > 0 && $(videoSliderJS.vrs.id + ' > div').length > 1) {
				$(videoSliderJS.vrs.id).camera({
					alignment: 'centerLeft',
					loader: 'pie',
					time: 3500,
					height: '340px',
					playPause: false,
					transPeriod: 500,
					fx: 'simpleFade',
					loader: 'none',
					navigation: false,
					onEndTransition: videoSliderJS.ltr.bgImageHandler,
					onStartLoading: videoSliderJS.ltr.videoIconHandler,
				});
			}
		}
	}
}

var txtImageSilderJS = {
	vrs: {
		container: '.txt-image-slider',
		item: '.txt-image-item',
		$container: '',
		$texts: '',
		$images: '',
		time: 400,
		current: 0,
		total: 0,
		imageHeight: '400px'
	},
	ltr: {
		nextHandler: function (){
			if (!txtImageSilderJS.vrs.$container.hasClass('loading')) {
				if ((txtImageSilderJS.vrs.current+1) < txtImageSilderJS.vrs.total) {
					txtImageSilderJS.vrs.$container.addClass('loading')
					txtImageSilderJS.vrs.$images.find('.image-item.active').css('z-index', 1).removeClass('active').fadeOut(txtImageSilderJS.vrs.time);
					txtImageSilderJS.vrs.$texts.find('.text-item.active').css('z-index', 1).removeClass('active').fadeOut(txtImageSilderJS.vrs.time);
					txtImageSilderJS.vrs.current += 1;
					setTimeout(function(){
						txtImageSilderJS.vrs.$images.find('.image-item[data-index="'+(txtImageSilderJS.vrs.current)+'"]').css('z-index', 3).addClass('active').fadeIn(txtImageSilderJS.vrs.time, function(){
							txtImageSilderJS.vrs.$container.removeClass('loading')
						});
						txtImageSilderJS.vrs.$texts.find('.text-item[data-index="'+(txtImageSilderJS.vrs.current)+'"]').css('z-index', 3).addClass('active').fadeIn(txtImageSilderJS.vrs.time);
					}, 200);
				}
			}
		},
		previousHandler: function() {
			if (!txtImageSilderJS.vrs.$container.hasClass('loading')) {
				if ((txtImageSilderJS.vrs.current-1) >= 0) {
					txtImageSilderJS.vrs.$container.addClass('loading')
					txtImageSilderJS.vrs.$images.find('.image-item.active').css('z-index', 1).removeClass('active').fadeOut(txtImageSilderJS.vrs.time);
					txtImageSilderJS.vrs.$texts.find('.text-item.active').css('z-index', 1).removeClass('active').fadeOut(txtImageSilderJS.vrs.time);
					txtImageSilderJS.vrs.current -= 1;
					setTimeout(function(){
						txtImageSilderJS.vrs.$images.find('.image-item[data-index="'+(txtImageSilderJS.vrs.current)+'"]').css('z-index', 3).addClass('active').fadeIn(txtImageSilderJS.vrs.time, function(){
							txtImageSilderJS.vrs.$container.removeClass('loading')
						});
						txtImageSilderJS.vrs.$texts.find('.text-item[data-index="'+(txtImageSilderJS.vrs.current)+'"]').css('z-index', 3).addClass('active').fadeIn(txtImageSilderJS.vrs.time);
					}, 200);
				}
			}
		},
		_setContainerHeight: function() {
			var previousCss = txtImageSilderJS.vrs.$container.attr("style");
			txtImageSilderJS.vrs.$container.css({
		        position:   'absolute',
		        visibility: 'hidden',
		        display:    'block'
		    });

			var imageHeight = 0;
			var textHeight = 0;

			var pt = parseInt(txtImageSilderJS.vrs.$images.css('padding-top'));

			var images = txtImageSilderJS.vrs.$images.find('.image-item')
			images.each(function(index){
				$(this).css({'display': 'block', 'position': 'absolute'});
				var pl = (parseInt(txtImageSilderJS.vrs.$container.width()) - parseInt($(this).width())) / 2;
				imageHeight = imageHeight > parseInt($(this).outerHeight()) ? imageHeight : parseInt($(this).outerHeight());
				// $(this).css({'top': pt, 'left': pl});
			});

			// var texts = txtImageSilderJS.vrs.$texts.find('.text-item')
			// texts.each(function(index){
			// 	textHeight = textHeight > parseInt($(this).outerHeight()) ? textHeight : parseInt($(this).outerHeight());
			// 	$(this).css({'display': 'block', 'position': 'absolute', 'top': 0, 'left': 0});
			// });

			imageHeight += pt + parseInt(txtImageSilderJS.vrs.$images.css('padding-bottom'));
			textHeight += parseInt(txtImageSilderJS.vrs.$texts.css('padding-top')) + parseInt(txtImageSilderJS.vrs.$texts.css('padding-bottom'));

			// txtImageSilderJS.vrs.$images.css('height', imageHeight);
			txtImageSilderJS.vrs.$texts.css('height', '120px');

			txtImageSilderJS.vrs.$container.attr("style", previousCss ? previousCss : "");
		},

	},
	cfn: {
		init: function() {
			var $container = txtImageSilderJS.vrs.$container = $(txtImageSilderJS.vrs.container);

			if ($container.length > 0) {
				$container.css('display', 'none');

				var $items = $container.find(txtImageSilderJS.vrs.item);

				if ($items.length>0) {

					txtImageSilderJS.vrs.total = $items.length;

					var $images = txtImageSilderJS.vrs.$images = $container.append('<div class="images-container"></div>').find('.images-container').first();
					var $texts = txtImageSilderJS.vrs.$texts = $container.append('<div class="texts-container"></div>').find('.texts-container').first();

					$images.css('height', txtImageSilderJS.vrs.imageHeight);

					$items.each(function(index) {
						var $item = $(this);
						$images.append('<div class="image-item" style="width: 100%; height: 100%; left: 0px; top: 0px;" data-index="'+index+'"></div>');
						$images.find('div.image-item[data-index="'+index+'"]').first().append($item.find('div.image-source')).css('z-index', 1);
						$texts.append('<div class="text-item" data-index="'+index+'" style="z-index: 1;">'+$item.find('p').html()+'</div>');

						$item.remove();
					});

					txtImageSilderJS.ltr._setContainerHeight();

					$texts.append('<div class="btn-previous"></div>');
					$texts.append('<div class="btn-next"></div>');

					$texts.find('.btn-previous').bind('click', txtImageSilderJS.ltr.previousHandler);
					$texts.find('.btn-next').bind('click', txtImageSilderJS.ltr.nextHandler);

					$images.find('.image-item').hide().first().css('display', 'block').addClass('active');
					$texts.find('.text-item').hide().first().css('display', 'block').addClass('active');

					$container.css('display', 'block');
				}
			}
		}
	}
}

var mainSubmenuJS = {
	vrs: {
		menu: 			'header ul.navbar-nav:not(.mobile)',
		menuItem: 		'header ul.navbar-nav:not(.mobile) > li',
		subMenu: 		'.sub-menu',
		subMenuItem:	'.sub-item',
		subMenuContent:	'.content-box'
	},
	ltr: {
		stickyHeaderHandler: function() {
			if ( $( window ).scrollTop()  >  ($('#header').height()) ) {
				$('header').first().addClass('fixed-top');
			} else {
				$('header').first().removeClass('fixed-top');
			}
		},
		displaySubMenuHandler: function($item) {
			var $submenu = $item.find('ul.sub-menu');
			if ($item.hasClass('hover')) {
				var $default = $submenu.find(mainSubmenuJS.vrs.subMenuItem +".active");
				if ($default.length>0) {
					mainSubmenuJS.ltr.subMenuItemHandler($default);
				}
				$submenu.fadeIn(200);
			} else {
				$submenu.fadeOut(200);
			}
		},
		submenuHoverHandler: function(e) {
			var $this = $(e.currentTarget);
			if ($this.hasClass('has-menu')){
				$this.addClass('hover');
				setTimeout(function(){
					mainSubmenuJS.ltr.displaySubMenuHandler($this);
				}, 200);
			}
		},
		submenuHiddenHandler: function(e) {
			var $this = $(e.currentTarget);
			if ($this.hasClass('has-menu')){
				$this.removeClass('hover');
				setTimeout(function(){
					mainSubmenuJS.ltr.displaySubMenuHandler($this);
				}, 200);
			}
		},
		subMenuContentBoxHandler: function($contentBox) {
			if ($contentBox.hasClass('loaded')) {
				$contentBox.siblings().hide();
				$contentBox.fadeIn(200);
			} else {
				var $parent = $contentBox.parent('div');
				// var $loading = $parent.find('.overlay-loading');
				// if ($loading.length==0) {
				// 	$parent.append('<div class="overlay-loading" style="top: 0;left: 0;width: 100%;height: 100%; overflow: overlay; background-color: #000; opacity: 0.5;z-index: 9999;position: absolute;text-align:center; display: block;font-size: 5em;"><div style="height: 100%; display: table; position: relative; width: 100%; "><i style="display: table-cell; vertical-align: middle;" class="fa fa-spinner fa-pulse"></i></div></div>');
				// }

				var category = $contentBox.attr('data-category');
				var tag = $contentBox.attr('data-tag');
				var limit = $contentBox.attr('data-limit');

				$.ajax({
					type: 'post',
					url: 'article/ajax/sub-menu-article',
					data: {'category_id': category, 'tag_id': tag, 'limit': limit},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							$contentBox.html(data.html);
							$contentBox.addClass('loaded');
							$contentBox.siblings().hide();
							$contentBox.fadeIn(200);
							// $parent.find('div.overlay-loading').remove();
						}
					}
				});
			}
		},
		subMenuItemHandler: function($this){
			$this.addClass('active').siblings().removeClass('active');
			var category = $this.attr('data-category');
			var tag = $this.attr('data-tag');
			var $contentBox = $(mainSubmenuJS.vrs.menuItem).find(mainSubmenuJS.vrs.subMenuContent+"[data-category='"+category+"'][data-tag='"+tag+"']");
			setTimeout(function(){
				if ($this.hasClass('active')) {
					mainSubmenuJS.ltr.subMenuContentBoxHandler($contentBox);
				}
			}, 200);
		}
	},
	cfn:{
		init: function() {

			$(window).on('scroll', mainSubmenuJS.ltr.stickyHeaderHandler);

			$(mainSubmenuJS.vrs.menuItem).each(function(index, obj){
				var $item = $(obj);

				if ($item.hasClass('no-sub-category')) {

					$item.hover(
						function(e) {
							mainSubmenuJS.ltr.submenuHoverHandler(e);
							var $li = $item.find('ul.sub-menu > li').first();
							mainSubmenuJS.ltr.subMenuItemHandler($li);
						},
						mainSubmenuJS.ltr.submenuHiddenHandler
					)
				} else {
					$item.hover(
						mainSubmenuJS.ltr.submenuHoverHandler,
						mainSubmenuJS.ltr.submenuHiddenHandler
					)
				}

				$item.find(mainSubmenuJS.vrs.subMenuItem).each(function(i, subItem){
					var $subItem = $(subItem);

					$subItem.hover(
						function() {
							var $this = $(this);
							mainSubmenuJS.ltr.subMenuItemHandler($this);
						}
					);
				});
			});

			mainSubmenuJS.ltr.stickyHeaderHandler();
			// $(mainSubmenuJS.vrs.menuItem).first().find('ul.sub-menu').fadeIn(200);
			// $(mainSubmenuJS.vrs.menuItem).first().find('.content-box').first().parent('div').append('<div class="overlay-loading" style="top: 0;left: 0;width: 100%;height: 100%; overflow: overlay; background-color: #000; opacity: 0.5;z-index: 9999;position: absolute;text-align:center; display: block;font-size: 5em;"><div style="height: 100%; display: table; position: relative; width: 100%; "><i style="display: table-cell; vertical-align: middle;" class="fa fa-spinner fa-pulse"></i></div></div>');
		}
	}
}

var ajaxLoadMoreJS = {
	vrs: {
		btnLoad: '.btn-ajax-loadmore:not([data-action=""]):not([data-container=""]):not([data-item=""]):not([data-count=""])',
	},
	ltr: {
		loadMoreHandler: function(e){
			var $btn= $(this);

			if (!$btn.hasClass('loading')) {
				$btn.addClass('loading');

				var action = $btn.attr('data-action');
				var $container = $($btn.attr('data-container'));

				if ($container.hasClass('all-data-loaded')) {
					return true;
				}

				var item = $btn.attr('data-item');
				var _limit = $btn.attr('data-count');
				var _offset = $container.find(item).length;

				var datajson = $btn.attr('data-json');
				var dataobj = "";
				var postdata = {limit: _limit, offset: _offset };
				var formdata = {};

				if (typeof datajson !== 'undefined') {
					if (datajson.length > 0){
						dataobj = $.parseJSON(datajson);
					}
				}

				if ($.isPlainObject(dataobj)) {
					$.extend(formdata, postdata, dataobj);
				} else {
					formdata = postdata;
				}

				$.ajax({
					type: 'post',
					url: action,
					data: formdata,
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							if (data.html.trim().length > 0) {
								_callback = $btn.attr('data-callback');

								if (typeof _callback !== 'undefined') {
									var fn = window['reorder_eventlist'];
									if(typeof fn === 'function') {
									    fn(data.html);
									};
								} else {
									$container.append(data.html);
								}
								imageLazyLoadJS.ltr.updateImage();
							} else {
								$container.addClass('all-data-loaded');
							}
						}
					},
					complete: function (data) {
						if ($btn.attr('data-scrolling') == true) {
							var $scrolling = $container.parent('div.scrolling-loader-container');

							var scrolling_count = $btn.attr('data-scrolling-count');
							var count = $container.find(item).length;
							if (typeof scrolling_count == 'undefined') {
								scrolling_count = 30;
							}

							if (count > scrolling_count) {
								$scrolling.addClass('loading-finish');
								$btn.show();
							}
						}
						$btn.removeClass('loading');
					}
				});
			}
		},
		scrollingHandler: function() {
			$(".scrolling-loader-container:not(.loading-finish)").each(function(index, obj){
				var $container = $(obj);
				var ele = $container.find(".scrolling-end");

				if ($container.is(":visible")) {
					var on_screen = ajaxLoadMoreJS.ltr._isScrolledIntoView(ele);

					if (on_screen) {
						$container.find(ajaxLoadMoreJS.vrs.btnLoad).first().click();
					}
				}
			});
		},

		_isScrolledIntoView: function(elem) {
			var win = $(window);

			var viewport = {
				top : win.scrollTop(),
				left : win.scrollLeft()
			};
			viewport.right = viewport.left + win.width();
			viewport.bottom = viewport.top + win.height();

			var bounds = elem.offset();

		    bounds.right = bounds.left + elem.outerWidth();
		    bounds.bottom = bounds.top + elem.outerHeight();

		    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
		}
	},
	cfn:{
		init: function() {
			var $btns= $(ajaxLoadMoreJS.vrs.btnLoad);

			$btns.each(function(index, obj){
				var $btn = $(obj);
				$btn.bind('click', ajaxLoadMoreJS.ltr.loadMoreHandler);

				if ($btn.attr('data-scrolling') == true) {
					var $container = $($btn.attr('data-container'));
					$container.wrap('<div class="scrolling-loader-container" style="position: relative;"></div>');

					var $scrolling = $container.parent('div.scrolling-loader-container');
					$scrolling.append('<div class="scrolling-end" style="height: 0px; width: 0px;"></div>')
					$scrolling.append($btn);

					$(window).scroll(function() {
					    clearTimeout($.data(this, 'scrollTimer'));
					    $.data(this, 'scrollTimer', setTimeout(function() {
					        ajaxLoadMoreJS.ltr.scrollingHandler();
					    }, 100));
					});
					$btn.hide();
				}
			});
		}
	}
}

var mobileMenuJS = {
	vrs: {
		btnMenu: '#mobile-menu-trigger',
		menuContainer: 'nav.navbar.mobile',
		menuitem: 'nav.navbar.mobile ul.nav > li',
		$menuContainer: ''
	},
	ltr: {
		menuDisplayHandler: function(){
			$(mobileMenuJS.vrs.btnMenu).addClass('open');
			mobileMenuJS.vrs.$menuContainer.open( 'mobile-menu' );
			$('html').css('overflow', 'hidden');
		},
		menuHiddenHandler: function(){
			$(mobileMenuJS.vrs.btnMenu).removeClass('open');
			mobileMenuJS.vrs.$menuContainer.close( 'mobile-menu' );
			$('html').css('overflow', 'scroll');
		},
		menuClickHandler: function(){
			if ($(mobileMenuJS.vrs.btnMenu).hasClass('open')) {
				mobileMenuJS.ltr.menuHiddenHandler();
			} else {
				mobileMenuJS.ltr.menuDisplayHandler();
			}
		},
		submenuClickHandler: function(e){
			var $this = $(this);
			var $submenu = $this.find('ul.sub-menu');
			$(mobileMenuJS.vrs.menuContainer + ' ul.sub-menu').not($submenu).hide();
			$submenu.slideToggle();
		}
	},
	cfn:{
		init: function() {
			var $btn= $(mobileMenuJS.vrs.btnMenu);

			mobileMenuJS.vrs.$menuContainer = new slidebars();
			mobileMenuJS.vrs.$menuContainer.init();

			if ($btn.length > 0) {
				$btn.bind('click', mobileMenuJS.ltr.menuClickHandler);

				$(mobileMenuJS.vrs.menuitem).each(function(index, obj){
					var $item = $(obj);
					$submenu = $item.find('ul.sub-menu');
					if ($submenu.length>0) {
						$item.bind('click', mobileMenuJS.ltr.submenuClickHandler);
					}

				});
			}
		}
	}
}

var mobileSearchJS = {
	vrs: {
		btn: '#mobile-search',
		searchContainer: '.search-mobile-container',
	},
	ltr: {
		clickHandler: function(e){
			var $conatiner = $(mobileSearchJS.vrs.searchContainer).first();
			if ($conatiner.length>0) {
				$conatiner.slideToggle();
			}
		}
	},
	cfn:{
		init: function() {
			var $btn = $(mobileSearchJS.vrs.btn);

			if ($btn.length > 0) {
				$btn.bind('click', mobileSearchJS.ltr.clickHandler);
			}
		}
	}
}

var categorySliderJS = {
	vrs: {
		id: '#category_post_slider',
		_interval: false
	},
	ltr: {
		resizeSliderHandler: function() {
			var $slider = $("#category_post_slider").find(".camera_target_content .cameraContent .container");

			var height = 0;

			$slider.each(function(index, obj) {
				let $obj = $(obj);

				if ($obj.height() > height) {
					height = $obj.height();
				}
			});
			if (height != 0) {
				$("#category_post_slider").css('height', height);
			}
		}
	},
	cfn: {
		init: function() {
			if ($(categorySliderJS.vrs.id).length > 0) {
				$(categorySliderJS.vrs.id).camera({
					alignment: 'centerLeft',
					loader: 'pie',
					time: 3500000000,
					height: 'auto',
					playPause: false,
					transPeriod: 500,
					fx: 'simpleFade',
					loader: 'none',
					navigation: false,
					onLoaded: function() {
						categorySliderJS.vrs._interval = setInterval(function(){
							var $slider = $("#category_post_slider").find(".camera_target_content .cameraContent.cameracurrent .container");
							if ($slider.length>0) {
								// clearInterval(categorySliderJS.vrs._interval);
								categorySliderJS.ltr.resizeSliderHandler();
							}
						}, 300);
					}
				});
				$(window).resize(categorySliderJS.ltr.resizeSliderHandler);
			}
		}
	}
}

var mobileCatMenuJS = {
	vrs: {
		btnMenu: '#sub-category-menu-trigger',
		menuContainer: 'nav.navbar.mobile.subcat',
		$menuContainer: ''
	},
	ltr: {
		menuDisplayHandler: function(){
			$(mobileCatMenuJS.vrs.btnMenu).addClass('open');
			mobileCatMenuJS.vrs.$menuContainer.open( 'mobile-subcat-menu' );
			$('html').css('overflow-y', 'hidden');
		},
		menuHiddenHandler: function(){
			$(mobileCatMenuJS.vrs.btnMenu).removeClass('open');
			mobileCatMenuJS.vrs.$menuContainer.close( 'mobile-subcat-menu' );
			$('html').css('overflow-y', 'scroll');
		},
		menuClickHandler: function(){
			if ($(mobileCatMenuJS.vrs.btnMenu).hasClass('open')) {
				mobileCatMenuJS.ltr.menuHiddenHandler();
			} else {
				mobileCatMenuJS.ltr.menuDisplayHandler();
			}
		},
	},
	cfn:{
		init: function() {
			var $btn= $(mobileCatMenuJS.vrs.btnMenu);

			mobileCatMenuJS.vrs.$menuContainer = new slidebars();
			mobileCatMenuJS.vrs.$menuContainer.init();

			if ($btn.length > 0) {
				$btn.bind('click', mobileCatMenuJS.ltr.menuClickHandler);
			}
		}
	}
}

var subcateTopPostJS = {
	vrs: {
		container: 'body.cat_module.subcat'
	},
	ltr: {
	},
	cfn:{
		init: function() {
			if ($(subcateTopPostJS.vrs.container).length>0) {
				$("#top-category-post-container .container").append($("#category-post-container .post-container").first().clone());
				imageLazyLoadJS.ltr.updateImage();
			}
		}
	}
}

var contacUsJS = {
	vrs: {
		button: '#contactus-trigger, #mobile-contactus-trigger, #stickly-contactus-trigger',
		title: '聯絡我們',
	},
	ltr: {
		submitFormHandler: function(){
			return false;
		},
		displayFormHandler: function(e) {

			$.ajax({
				type: 'get',
				url: 'contactus/get-view?v=' + new Date().getTime(),
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						swal({
						  title: contacUsJS.vrs.title,
						  text: data.html,
						//   imageUrl: "assets/img/tagsis/tagsis_logo.png",
						//   imageSize: "227x82",
						  html: true,
						  allowOutsideClick: true,
						  customClass: 'contactus-form-container',
						  showCancelButton: true,
						  confirmButtonText: "Send",
						  cancelButtonText: "Close",
						  showLoaderOnConfirm: true,
						  closeOnConfirm: false,
					  }, function(value){

						  var $form = $(".contactus-form-container form").first();
						  var form_data = $form.serialize();

						  $.ajax({
							  type: 'post',
							  url: $form.attr('action'),
							  data: form_data,
							  success: function(data) {

								  if (data.success) {

									  swal({
										  title: "Sent successfully!",
										  text: "Thanks you for your enquiry.",
										  timer: 1500,
										  showConfirmButton: false
										});

								  } else {

									swal.showInputError("We are sorry, but there appears to be a problem with the form you submitted.");
									$("#captcha_image").click();
		  						    return false;

								  }
							  },
							  error: function () {
								swal.showInputError("We are sorry, but there appears to be a problem with the form you submitted.");
								return false;
							  }
						  });
						});

						$(".contactus-form-container").first().find("script").each(function() {
							eval($(this).text());
					   });
					}
				}
			});

		},
	},
	cfn:{
		init: function() {
			if ($(contacUsJS.vrs.button).length>0) {
				$(contacUsJS.vrs.button).bind('click', contacUsJS.ltr.displayFormHandler);
			}
		}
	}
}

var facebookVideoMaxWidthJS = {
	vrs: {
		container: 'body.article_module .article-content-container .article-content .fb-video:not(.checked-width)',
		_interval: "",

	},
	ltr: {

	},
	cfn:{
		init: function() {
			if ($(facebookVideoMaxWidthJS.vrs.container).length>0) {
				facebookVideoMaxWidthJS.vrs._interval = setInterval(function(){
					var $videos = $(facebookVideoMaxWidthJS.vrs.container);
					if ($videos.length > 0) {
						$videos.each(function(index, obj){
							var $this = $(obj);
							var init = $this.attr('fb-xfbml-state');
							if(init == 'rendered') {
								var $height = $this.height();
								var $width = $this.width();

								if ($height > 100 && $width > 0) {
									$this.addClass('checked-width');
									if ($height >= $width) {
										$this.addClass('fb-video-fixed-width');
									}

									$this.closest('div.video-embed-container').find('.video-embed-bg').first().hide();
								}
							}
						});

					} else {
						clearInterval(facebookVideoMaxWidthJS.vrs._interval);
					}
				}, 1500);
			}
		}
	}
}

var igSliderJS = {
	vrs: {
		container: '#tagsis-ig-slider',
	},
	ltr: {

	},
	cfn:{
		init: function() {
			var $container = $(igSliderJS.vrs.container);
			if ($container.length>0) {
				$container.css({'position': 'absolute', 'top': '-9999px', 'display': 'block'});
				$container.bxSlider({
					slideWidth: 282,
					minSlides: 1,
					maxSlides: 4,
					slideMargin: 0,
					infiniteLoop: false,
					hideControlOnEnd: true,
					// onSlideBefore: function($slideElement, oldIndex, newIndex){
					// 	if (!$container.hasClass('sliding')) {
					// 		$container.addClass('sliding');
					// 	} else {
					// 		return false;
					// 	}
					// },
					// onSlideAfter: function($slideElement, oldIndex, newIndex){
					// 	setTimeout(function(){$container.removeClass('sliding');}, 250);
					// }
				});

				$container.css({'position': 'relative', 'top': '0px'});
			}
		}
	}
}

var relatedArticleAlertJS = {
	vrs: {
		container: 'body.mobile #related-articles-alert-content',
		trigger: 'related-article-trigger',
		title: '聯絡我們',
	},
	ltr: {
		scrollingHandler: function() {
			var $trigger = $("#"+relatedArticleAlertJS.vrs.trigger);
			if ($trigger.is(":visible") && $trigger.attr('data-trigger') == 0) {
				var on_screen = relatedArticleAlertJS.ltr._isScrolledIntoView($trigger);

				if (on_screen) {

					$trigger.attr('data-trigger', 1);

					swal({
						title: "相關文章",
						text: $("#related-articles-alert-content").html(),
						html: true,
						allowOutsideClick: true,
						customClass: 'related-article-alert',
						confirmButtonText: '',
						animation: "slide-from-top",
					}, function(){
						if (document.location.href.indexOf('tagsis.com')>0) {
							ga('send', 'event', {eventCategory: 'Article Related Popup Total', eventAction: '1'});
						}
					});
				}
			}
	  	},
		_isScrolledIntoView: function(elem) {
			var win = $(window);

			var viewport = {
				top : win.scrollTop(),
				left : win.scrollLeft()
			};
			viewport.right = viewport.left + win.width();
			viewport.bottom = viewport.top + win.height();

			var bounds = elem.offset();

		    bounds.right = bounds.left + elem.outerWidth();
		    bounds.bottom = bounds.top + elem.outerHeight();

		    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
		}
	},
	cfn:{
		init: function() {
			if ($(relatedArticleAlertJS.vrs.container).length>0) {

				var $ap = $("body.article_module.mobile .article-content-container .article-content p");
				var plength = $ap.length;
				if (plength>0) {
					plength = Math.ceil(plength/2);

					$($ap.get(plength)).after("<div id='"+relatedArticleAlertJS.vrs.trigger+"' style='height: 0px; width: 0px; margin: 0px; padding: 0px;' data-trigger='0'></div>");

					$(window).scroll(function() {
					    clearTimeout($.data(this, 'scrollTimer'));
					    $.data(this, 'scrollTimer', setTimeout(function() {
					        relatedArticleAlertJS.ltr.scrollingHandler();
					    }, 25));
					});
				}
			}
		}
	}
}

var homeArticleSliderJS = {
	vrs: {
		container: '.home-article-slider-container',
		slider: '#home-article-slider',
		tinyscroll: '.home-title-article-container .title-article-container',
		$tinyscroll: '',

	},
	ltr: {

	},
	cfn:{
		init: function() {
			var $container = $(homeArticleSliderJS.vrs.container);
			var $slider = $(homeArticleSliderJS.vrs.slider);
			if ($slider.length>0) {
				$slider.bxSlider({
					slideMargin: 0,
					infiniteLoop: true,
					hideControlOnEnd: true,
					controls: true,
					// preloadImages: 'all',
					pager: true,
					pause: 3000,
					auto: true,
					autoHover: true,
					onSliderLoad: function() {
						$slider.addClass('loaded');
						$container.find('.slider-loading').addClass('hide');
						$(homeArticleSliderJS.vrs.tinyscroll).find('.title-article-item').first().addClass('active');
					},
					onSlideBefore: function($slideElement, oldIndex, newIndex) {
						var index = newIndex;
						var $items =$(homeArticleSliderJS.vrs.tinyscroll).find('.title-article-item');
						var $item = $($items.get(index));

						if (index <= ($items.length - 5)) {
							var positionTop = Math.abs($item.position().top);
							homeArticleSliderJS.vrs.$tinyscroll.update(positionTop);
						}

						$item.addClass('active').siblings().not($item).removeClass('active');
					}
				});
			}

			var $tinyscroll = $(homeArticleSliderJS.vrs.tinyscroll).tinyscrollbar({ thumbSize: 75, thumbSizeMin: 10 });
			if ($tinyscroll.length > 0) {
				homeArticleSliderJS.vrs.$tinyscroll = $tinyscroll.data("plugin_tinyscrollbar");
			}
		}
	}
}

homeArticleSliderJS.cfn.init();

var imageLazyLoadJS = {
	vrs: {
		selector: '.img-lazyload',
		instance: false,
	},
	ltr: {
		beforeLoadHandler: function(ele) {
		},
		updateImage: function() {
			if (imageLazyLoadJS.vrs.instance) {
				var $images = $(imageLazyLoadJS.vrs.selector+':not(.lazy-loaded)');
				imageLazyLoadJS.vrs.instance.addItems($images);
			}
		},
		afterLoadHandler: function(ele) {
			var $this = $(ele);
			$this.addClass('lazy-loaded');
		}
	},
	cfn: {
		init: function() {
			var $images = $(imageLazyLoadJS.vrs.selector);
			if ($images.length > 0) {
				imageLazyLoadJS.vrs.instance = $(imageLazyLoadJS.vrs.selector).Lazy({
					beforeLoad: imageLazyLoadJS.ltr.beforeLoadHandler,
					afterLoad: imageLazyLoadJS.ltr.afterLoadHandler,
					removeAttribute: false,
					chainable: false,
					autoDestroy: false,
					visibleOnly: false,
					threshold: 400
				});
			}
		}
	}
}

imageLazyLoadJS.cfn.init();

$(document).ready(function(){
	mainSubmenuJS.cfn.init();
	homeBannerJS.cfn.init();
	videoSliderJS.cfn.init();
	categorySliderJS.cfn.init();
	txtImageSilderJS.cfn.init();
	facebookVideoMaxWidthJS.cfn.init();
	ajaxLoadMoreJS.cfn.init();
	mobileMenuJS.cfn.init();
	mobileSearchJS.cfn.init();
	mobileCatMenuJS.cfn.init();
	contacUsJS.cfn.init();
	subcateTopPostJS.cfn.init();
	// toTopJS.cfn.init();
	igSliderJS.cfn.init();
	// relatedArticleAlertJS.cfn.init();

	$(".btn-share-facebook > a, .btn-share-twitter > a").on('click', function(event){
		var b, c, d = $(this);
		event.preventDefault();
		b = 600, c = 400;
		var href = d.attr("href"),
			w = (window.outerWidth - b) / 2,
			h = (window.outerHeight - c) / 2;
		window.open(href, "_blank", "width=" + b + ",height=" + c + ",titlebar=0,left=" + w + ",top=" + h);
	});

	// show web push permission button
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) != true) {
        $(".btn-push").css("display","block");
      }

});


function adscale(){
	scalew=window.innerWidth/320;scaleh=window.innerHeight/80;
    if(window.innerHeight > window.innerWidth){
        scale=(scalew<scaleh?scalew:scaleh);
    }else{
        scale=1;
    }
    if(document.querySelector(".ads-box-container.ads-320.floating .ads-box.ads-320")!==null){
        document.querySelector(".ads-box-container.ads-320.floating .ads-box.ads-320").style.webkitTransform='scale('+scale+')';
        document.querySelector(".ads-box-container.ads-320.floating .ads-box.ads-320").style.transform='scale('+scale+')';
	}
}
window.onresize=function(){adscale();};
adscale();
