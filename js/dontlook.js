// http://vrvu.com/wp-content/uploads/sites/6/2015/12/gear-vr_feature_unrivaled-immersion.png
// http://hhassan1230.github.io/CodePenImgs/imagesLesson1/DontLookAwayLogoFinal1.png
// https://pbs.twimg.com/media/Ct-IZb5WgAAmR2t.jpg
// http://hhassan1230.github.io/CodePenImgs/imagesLesson1/CoverB2.png
var delayTime = 4400;
// fullanimtime / 3;

$(window).on("load", function() {
  $('section').eq(0).scrollTop(0);
  // Put Back These Slides
  $('.vr-view').addClass('expand');
  $('.vr-goggles').addClass('fadeout expand-goggles');

  // $('.vr-view').delay(delayTime+5000).addClass('vr-view-shift-up');

    // Put Back These Slides
    // FF I need to give padd div padding top like 20%

  setTimeout(function () {
    $('.vr-goggles').remove();
    $('.text-panel').wrap('<div class="padd"><div class="table"><div class="cell">').fadeIn(600);
    $('.text-panel, .down-arrow').addClass('fadein');
    $('a.down-arrow i').delay(1500).shake();
    $('body').removeClass('no-scroll').addClass('scroll');
  }, delayTime/2);
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
  window.location = '#intro';
  $('.ver-view').addClass('vr-view-shift-up');
  $('body').addClass('no-scroll');
  $('section').smoothScroll({
    delegateSelector: 'a.down-arrow'
  });
});
