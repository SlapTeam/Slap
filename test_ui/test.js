$(function() {
  $('.slp_token').on('click', function(e) {
    if (e.target.className == 'slp_token') {
      $(e.target).children('.slp_popup').toggleClass('slp_popup_visible');
    }
    e.stopPropagation();
  });

  $(document).click(function() {
    $('.slp_popup').removeClass('slp_popup_visible');
  });

  $('.slp_popup li textarea').on('keydown', function(e) {
    if (e.which == 13) {
      if (e.ctrlKey) {
        e.target.value += '\n';
      }
      else {
        console.log('saving comment!', e.target.value);
        $('.slp_popup').removeClass('slp_popup_visible');
        e.target.value = '';
        e.target.blur();
      }
      e.preventDefault();
    }
  });
})
