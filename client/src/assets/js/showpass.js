// this of eye method
var inputPass2 = $('#pass2'),
    icon = $('.iconpass');

    $('.iconpass').click(function () {
    alert('hello');

  if(inputPass2.className == 'active') {
     inputPass2.setAttribute('type', 'text');
     icon.className = 'fa fa-eye';
    inputPass2.className = '';

  } else {
     inputPass2.setAttribute('type', 'password');
     icon.className = 'fa fa-eye-slash';
    inputPass2.className = 'active';
 }

});
