// http://vrvu.com/wp-content/uploads/sites/6/2015/12/gear-vr_feature_unrivaled-immersion.png
// http://hhassan1230.github.io/CodePenImgs/imagesLesson1/DontLookAwayLogoFinal1.png
// https://pbs.twimg.com/media/Ct-IZb5WgAAmR2t.jpg
// http://hhassan1230.github.io/CodePenImgs/imagesLesson1/CoverB2.png
var delayTime = 4400;
// fullanimtime / 3;

$(window).on("load", function() {
  $('.vr-view').addClass('expand');
  $('.vr-goggles').addClass('fadeout expand-goggles');
  $('.text-panel, .down-arrow').addClass('fadein');
  $('body').delay(delayTime).removeClass('no-scroll').addClass('scroll');
  // $('.vr-view').delay(delayTime+5000).addClass('vr-view-shift-up');
  setTimeout(function(){
	  $('.vr-view').addClass('vr-view-shift-up');
  }, delayTime+2000);
});

jQuery.fn.shake = function() {
  this.each(function(i) {
    $(this).css({ "position": "relative" });
    for (var x = 1; x <= 3; x++) {
        $(this).animate({ left: -10 }, 100).animate({ left: 0 }, 100).animate({ left: 10 }, 100).animate({ left: 0 }, 100);
    }
  });
  return this;
}

$(function () {
  $(document).scrollTop(0);
	$('body').addClass('no-scroll');
  $('section').smoothScroll({
    delegateSelector: 'a.down-arrow'
  });
  $('a.down-arrow i').delay(2500).shake();
});
