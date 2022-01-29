$( document ).ready(function(){

    // this of eye method
var inputPass2 = $('#pass2'),
icon = $('.iconpass');

$('.iconpass').click(function () {
// alert('hello');

if(inputPass2.className == 'active') {
 inputPass2.attr('type', 'text');
 icon.className = 'fa fa-eye';
 icon.css('cssText','color:#797979;')
inputPass2.className = '';

} else {
 inputPass2.attr('type', 'password');
 icon.className = 'fa fa-eye-slash';
 icon.css('cssText','color:#acacac;');
inputPass2.className = 'active';
}

});
$(".searchForm__buttonIcon").on("click", function (e) {
  $(".searchForm").addClass("active");
  e.stopPropagation()
  });
  
  $(document).on("click", function (e) {
  if ($(e.target).is(".searchForm__input,.searchForm__buttonSearch") === false) {
  $(".searchForm").removeClass("active");
  }
  });


    // this of eye method
    var inputPass3 = $('#pass3'),
    icon3 = $('.iconpass3');
    
    $('.iconpass3').click(function () {
    // alert('hello');
    
    if(inputPass3.className == 'active') {
        inputPass3.attr('type', 'text');
        icon3.className = 'fa fa-eye';
        icon3.css('cssText','color:#797979;')
     inputPass3.className = '';
    
    } else {
        inputPass3.attr('type', 'password');
        icon3.className = 'fa fa-eye-slash';
        icon3.css('cssText','color:#acacac;');
     inputPass3.className = 'active';
    }
    
    });


    var browser=Check_Version();
    console.log(browser);

    if ((browser!= 12)){
        $(".iestop").remove();
        $(".hp-link").removeAttr("data-aos");
        $(".hp-link").removeAttr("data-aos-duration");
        $(".hp-link").removeAttr("data-aos-easing");

        $(".more").removeAttr("data-aos");
        $(".more").removeAttr("data-aos-duration");
        $(".more").removeAttr("data-aos-easing");

        $(".col-md-6").removeAttr("data-aos");
        $(".col-md-6").removeAttr("data-aos-duration");
        $(".col-md-6").removeAttr("data-aos-easing");


        
        		
        $(".svg-div-2").css('cssText','background-image:url("img/svg2.gif");background-repeat: no-repeat;background-position: center;');
        $(".svg-div-1").css('cssText','background-image:url("img/svg1.gif");background-repeat: no-repeat;background-position: center;');
  
    }else{
        AOS.init({
			
            once: true,
        });
    }
	
	
	
  $(".profile-2").click(function(){
      $(".progressive-1").delay(300).fadeOut();
      $(".progressive-2").delay(500).fadeIn();
      $(".grey-header").delay(500).fadeIn();
      
  })
  
   
    $(document).scroll(function() {
        if($(window).scrollTop()>0){
            // $( ".white-subs" ).css("cssText","transform:translateY(100vh);").delay(-1).fadeOut();
            $( ".white-subs" ).animate({top:1500} ,{duration:100}).fadeOut();
          
        }
      });

var $container = $('.dropdown-menu'),
$list = $('.dropdown-menu ul'),
listItem = $list.find('li');

$(".dropdown .title").click(function () {
if( $container.height() > 0) {
closeMenu(this);
} else {
openMenu(this);
}
});

$(".dropdown-menu li").click(function () {
closeMenu(this);
});

function closeMenu(el) {
    $(el).closest('.dropdown').toggleClass("closed").find(".title").text($(el).text());
    $container.css("height", 0);
    $list.css( "top", 0 );
  }
  
  function openMenu(el) {
    $(el).parent().toggleClass("closed");
    
    $container.css({
      height: 80
    })
  }
  $(".pen-edit").click(function(){
    window.location.href = "Signup.html";
  });
  $(".prev-prog").click(function(){
    if($(".step5").is(":visible")){
        $(".step5").fadeOut().delay(500);
        $(".step4").delay(500).fadeIn();
        $(".bar1").removeClass("active");
        $(".bar2").removeClass("done").addClass("active");
    }
    if($(".step4").is(":visible")){
        $(".step4").fadeOut().delay(500);
        $(".step3").delay(500).fadeIn();
        $(".bar2").removeClass("active");
        $(".bar3").removeClass("done").addClass("active");
    }
    if($(".step3").is(":visible")){
        $(".step3").fadeOut().delay(500);
        $(".step2").delay(500).fadeIn();
        $(".bar3").removeClass("active");
        $(".bar4").removeClass("done").addClass("active");
    }
    if($(".step2").is(":visible")){
        $(".step2").fadeOut().delay(500);
        $(".step1").delay(500).fadeIn();
        $(".bar4").removeClass("active");
        $(".bar5").removeClass("done").addClass("active");
    }
  });
  $(".next-prog").click(function(){
      if($(".step1").is(":visible")){
        $(".step1").fadeOut().delay(500);
        $(".step2").delay(500).fadeIn();
        $(".bar5").addClass("done").removeClass("active");
        $(".bar4").addClass("active");
        $(".pen-edit").remove();
        $("#account-type").removeAttr('id');
      }
      if($(".step2").is(":visible")){
        $(".step2").fadeOut().delay(500);
        $(".step3").delay(500).fadeIn();
        $(".bar4").addClass("done").removeClass("active");
        $(".bar3").addClass("active");
      }
      if($(".step3").is(":visible")){
        $(".step3").fadeOut().delay(500);
        $(".step4").delay(500).fadeIn();
        $(".bar3").addClass("done").removeClass("active");
        $(".bar2").addClass("active");
      }
      if($(".step4").is(":visible")){
        $(".step4").fadeOut().delay(500);
        $(".step5").delay(500).fadeIn();
        $(".bar2").addClass("done").removeClass("active");
        $(".bar1").addClass("active");
      }
  });

  $("#pass3").keyup(function(){
      if($(".next-prog").is(":visible")){
        if(($("#pass2").val()!=null)||($("#pass2").val()!='')){
            $(".next-prog").fadeOut().delay(500);
            $("a.cancel-reg").delay(500).fadeIn();
            $("a.register").delay(500).fadeIn();
        }
      }
    
  });
 

$(document).on('click', '.date-picker .input', function(e){
    var $me = $(this),
            $parent = $me.parents('.date-picker');
    $parent.toggleClass('open');
});


$(".calendar").on("change",function(){
    var $me = $(this),
            $selected = $me.val(),
            $parent = $me.parents('.date-picker');
    $parent.find('.result').children('span').html($selected);
});
    
});
function Check_Version(){
    var rv = -1; // Return value assumes failure.

    if (navigator.appName == 'Microsoft Internet Explorer'){

       var ua = navigator.userAgent,
           re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

       if (re.exec(ua) !== null){
         rv = parseFloat( RegExp.$1 );
       }
    }
    else if(navigator.appName == "Netscape"){                       
       /// in IE 11 the navigator.appVersion says 'trident'
       /// in Edge the navigator.appVersion does not say trident
       if(navigator.appVersion.indexOf('Trident') === -1) rv = 12;
       else rv = 11;
    }       

    return rv;          
}

  