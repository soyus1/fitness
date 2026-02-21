// header
$(function(){
	$(window).scroll(function(){
	    if ($(this).scrollTop() > 0){
	            $('header').addClass('shrink');
	        }
	        else{
	            $('header').removeClass('shrink');
	        }
	    });
});

//modal

$(".modal-trigger").click(function(e){
  e.preventDefault();
  dataModal = $(this).attr("data-modal");
  $("#" + dataModal).css({"display":"block"});
});

$(".close-modal, .modal-sandbox").click(function(){
  $(".modal").css({"display":"none"});
});

//nav-mobile

$('.burger').click(function(){
  $('.burger').toggleClass('cross');
  $('.nav').toggleClass('show');
});

$(document).mouseup(function(e) {
  var $target = $(e.target);
  if ($target.closest(".nav").length == 0 && $target.closest(".burger").length == 0) {
    $(".nav").removeClass("show");
  }
});

$(document).mouseup(function(e) {
  var $target = $(e.target);
  if ($target.closest(".nav.show").length == 0 && $target.closest(".burger").length == 0) {
    $(".burger").removeClass("cross");
  }
});

// Scroll Progress.

function scrollProgress (element) {
  const progress = document.querySelector(element)
  const path = progress.querySelector('path')
  const length = path.getTotalLength()
  progress.setAttribute('aria-valuemax', `100%`)
  progress.setAttribute('aria-valuenow', `0%`)
  progress.setAttribute('role', `progress`)
  path.setAttribute('aria-hidden', `true`)
  const scrollable = () => {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scroll = parseFloat(top / height * length)
    let value = parseFloat(top / height * 100).toFixed(0)
    path.setAttribute('stroke-dashoffset', -(length - scroll))
    progress.setAttribute('aria-valuenow', `${value}%`)
  }
  window.addEventListener('scroll', scrollable)
}
scrollProgress('.scroll-progress-circle')

if($(window).width() > 767) {
  $('.video-mob').remove();
} else {
  $('.video-desc').remove();
}

