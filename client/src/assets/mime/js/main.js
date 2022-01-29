

$(function() {
   
    $('.triggerSidebar').click(function() {
       
        if(document.getElementsByTagName("html")[0].dir=="rtl"){
            $('.sidebar').css('right', '0px')
            $('.overlay').css('display', 'block')
        }else{
            $('.sidebar').css('left', '0px')
            $('.overlay').css('display', 'block')
        }
     })
     
     var sembunyikan = function() {
        if(document.getElementsByTagName("html")[0].dir=="rtl"){
            $('.overlay').css('display', 'none')
            $('.sidebar').css('right', '-300px')
        }else{
            $('.overlay').css('display', 'none')
            $('.sidebar').css('left', '-300px')
        }
     }
     
     $('.hideSidebar').click(sembunyikan)
     $('.overlay').click(sembunyikan)
   
});
$('.owl_hero').owlCarousel({
    loop:true,
    margin:0,
    responsiveClass:true,
    dots:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:1,
            nav:false
        },
        1000:{
            items:1,
            nav:true,
            loop:false
        }
    }
})
$('.owl_sponsers').owlCarousel({
    loop:true,
     navText : ["<img src='./assets/images/arrow-right-solid.svg' class='slider_icon'/>","<img src='./assets/images/arrow-right-solid.svg' class='slider_icon_right'/>"],
    margin:10,
    responsiveClass:true,
    dots:false,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:1,
            nav:false
        },
        1000:{
            items:4,
            nav:true,
            loop:false
        }
    }
})
var wow = new WOW(
    {
      boxClass:     'wow',      // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset:       0,          // distance to the element when triggering the animation (default is 0)
      mobile:       true,       // trigger animations on mobile devices (default is true)
      live:         true,       // act on asynchronously loaded content (default is true)
      callback:     function(box) {
        // the callback is fired every time an animation is started
        // the argument that is passed in is the DOM node being animated
      },
      scrollContainer: null,    // optional scroll container selector, otherwise use window,
      resetAnimation: true,     // reset animation on end (default is true)
    }
  );
  wow.init();
