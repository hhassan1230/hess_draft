$("document").ready(function(){
  if ($(window).width() < 750){
    $("#hamburger").on('click', function(){        
      if (this.classList.contains("is-active")) {
        this.classList.remove("is-active");
        $('.nav-list').hide();
      } else {
        this.classList.add("is-active");
        $('.nav-list').show();
      };
    })
    $(".moveTo").on("click", function(){
      checkHam();
      var clicked = $(this).attr('href');
      scrolling(clicked);
      return false;
    });
  } else {
    $(".moveTo").on("click", function(){
      var clicked = $(this).attr('href');
      scrolling(clicked);
      return false;
    });
  };

  $( window ).resize(function() {
    if ($(window).width() < 750) {
      $('.nav-list').hide(); 
      $("#hamburger").removeClass("is-active");
    } else{
      $('.nav-list').show(); 
    };
  });

  function scrolling(clicked) {
    $('html, body').animate({
        scrollTop: $(clicked).offset().top - 35
      }, 1000);
  }
  function checkHam() {
    if ($(".c-hamburger--rot").hasClass('is-active')) {
      $('#hamburger').removeClass("is-active");
      if ($(window).width() < 750) {
        $('.nav-list').hide();
      };
    };
  }
  $('.button-big').on('click', function(){
    var openings = {
      facebook: '//www.linkedin.com/in/hessvacio/',
      twitter: '//twitter.com/hessvacio',
      dribbble: '//github.com/hhassan1230'
    };
    var socalMedia = $(this).attr('class').split(" ")[0];
    socalMedia ? window.open(openings[socalMedia]) : null;
  });
  // Change Logo on Hover
  $( "#h-logo" ).mouseleave(function() {
    $( "#h-logo" ).attr( "src", "./images/Hessvacio_logo_blacknwhite.png" );
  });
  $( "#h-logo" ).mouseover(function() {
    $( "#h-logo" ).attr( "src", "./images/Hessvacio_logo_hover.png" );
  });
    // Change About me on Hover
  $( "#hess-logo" ).mouseleave(function() {
    $( "#hess-logo>#hess-logo-img" ).attr( "src", "./img/Hessvacio_logo.png" );
  });
  $( "#hess-logo" ).mouseover(function() {
    $( "#hess-logo>#hess-logo-img" ).attr( "src", "./img/Hessvacio_logo_hover.png" );
  });
})