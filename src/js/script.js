$(document).ready(function () {

    $('.show-partners').on('click', function () {
       $('.partners-hidden').slideDown(function () {
           $('.show-partners').hide();
           $('.partners-hidden').removeClass('partners-hidden');
       })
    });

    $('.top-navbar__a--js').on('click', function (e) {
        e.preventDefault();
        $.scrollTo( $(this).attr('href'), 1500, { offset:'' });
    });

    $('.arrow-top').on('click', function(){
        $.scrollTo( 0,1500, { offset:'' });
        return false;
    });

    $(window).on('scroll', throttle(function(){
        checkArrowTop();
        stickyHeader();
        updateAnchors();
    }, 50));

    checkArrowTop();
    stickyHeader();
    updateAnchors();

    $('.feedback').on('init', function (slick) {
        var Slick = slick.target;
        var sliders = Slick.children[1];

        $(Slick).prepend('<div class="slick-avatars"><div></div></div>');
        var avatars = $(Slick).find('.slick-avatars div');

        $(sliders)
            .find('.slick-slide:not(.slick-cloned)')

            .each(function (i,e) {
                var avatar = $(e).find('.feedback__avatar');

                avatar.attr({ 'data-index': i });
                avatars.append(avatar);
            });

        $(sliders)
            .find('.slick-slide')
            .each(function (i,e) {
                $(e).find('.feedback__avatar').hide();
            });

        avatars
            .find('.feedback__avatar')
            .first()
            .addClass('slick-active');
    });

    $('.feedback').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        var Slick = slick.$slider;
        var avatars = $(Slick).find('.slick-avatars');

        avatars
            .find('.feedback__avatar.slick-active')
            .removeClass('slick-active');

        avatars
            .find('.feedback__avatar:nth-child('+ (nextSlide +1) +')')
            .addClass('slick-active');

        if( $(window).width() < 576 ){
            var _avatars = $('.feedback .slick-avatars div');
            var transform = nextSlide * 120 * (-1) + 118;
            _avatars.css({ transform: 'translate3d( '+ transform +'px, 0px, 0px)' })
        }

    });

    $('.feedback').slick({
        dots: true,
        arrows: true,
        centerMode: false
    });

    $('.feedback').on('click', '.feedback__avatar', function () {
        $('.feedback').slick('slickGoTo', $(this).attr('data-index'));

        //console.log( $(this).attr('data-index') )
    });

    var offers;


    offersSlider();

    $(window).on('resize', debounce(function () {
        offersSlider();

        if( $(window).width() <= 576 ){
            // set the avatars position
            var _avatars = $('.feedback .slick-avatars div');
            var transform = $('.feedback .slick-active').attr('data-index') * 120 * (-1) + 118;
            _avatars.css({ transform: 'translate3d( '+ transform +'px, 0px, 0px)' })
        }else{
            // reset the avatars position
            $('.feedback .slick-avatars div').css({ transform: 'none' })
        }

    }, 200));

    function checkArrowTop() {
        if( _getPageScroll() > $(window).height() ){
            $('.arrow-top').fadeIn();
        }else{
            $('.arrow-top').fadeOut();
        }
    }

    function stickyHeader() {
        if( _getPageScroll() > 1 ){
          $('.header').addClass('is-active');
        }else{
          $('.header').removeClass('is-active')
        }
    }

    function updateAnchors(){
      // Cache selectors
      var scrollAnchors = $(".top-navbar__menu").find(".top-navbar__li");
      var sections = $('.container--section');
      var headerHeight = $('.header').height();
      var vScroll = $(window).scrollTop();

      // Get id of current scroll item
      var cur = sections.map(function(){
       if ($(this).offset().top < vScroll + (headerHeight / 2))
         return this;
      });
      // Get current element
      cur = $(cur[cur.length-1]);
      var id = cur && cur.length ? cur.attr('id') : "1";

      // update hash
      // setTimeout(function(){
      //   window.location.hash = id
      // },1000)

      // Set/remove active class
      var activeAnchor = scrollAnchors.find("[href='#"+id+"']").parent();
      activeAnchor.addClass("active");
      activeAnchor.siblings().removeClass("active");
    }

    function offersSlider() {
        if( $(window).width() < 768 && !$('.offers.slick-initialized').length ){
            offers = $('.offers li');
            return $('.offers').slick({
                dots: true,
                arrows: true,
                centerMode: true,
                centerPadding: '0px',
                slidesToShow: 1
            });
        }

        if( $(window).width() >= 768 && $('.offers.slick-initialized').length ){
            return $('.offers').slick('unslick').append(offers);
        }

    }

});


function _getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
        yScroll = self.pageYOffset;
        xScroll = self.pageXOffset
    } else if (document.documentElement && document.documentElement.scrollTop) {
        yScroll = document.documentElement.scrollTop;
        xScroll = document.documentElement.scrollLeft
    } else if (document.body) {
        yScroll = document.body.scrollTop;
        xScroll = document.body.scrollLeft
    }
    arrayPageScroll = new Array(xScroll, yScroll);
    return yScroll;
};
