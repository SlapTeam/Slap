$(function() {

  window.slap = {
    user: {
      email: 'andre@ventajou.com'
    }
  };

  function commentClick(e) {
    var el = $(e.target);
    if (el.hasClass('slp_commented')) {
      el = el.children('slp_token');
    }

    if (el.hasClass('slp_token')) {
      var popup = el.children('.slp_popup').get(0);

      $('.slp_popup').each(function() {
        if ($(this).get(0) == popup) {
          $(popup).toggleClass('slp_popup_visible');
        }
        else {
          $(this).removeClass('slp_popup_visible');
        }
      });
    }

    e.stopPropagation();
  }

  function keydownHandler(e) {
    if (e.which == 13) {
      if (e.ctrlKey) {
        e.target.value += '\n';
      }
      else {
        var selector = $(e.target).closest('.slp_comment').data('slp-id');

        var comment = {
          email: window.slap.user.email,
          date: new Date(),
          text: e.target.value
        };

        if (!window.slapComments[selector]) {
          window.slapComments[selector] = []
        }
        window.slapComments[selector].push(comment);
        addComment(selector, comment);
        $(selector + ' > .slp_comment .slp_count').text(window.slapComments[selector].length);
        e.target.value = '';
        e.target.blur();
      }
      e.preventDefault();
    }
  }

  function addComment(selector, comment) {
    var html = '<li><div class="slp_title">';
    if (comment.email) {
      var hash = MD5(comment.email);
      html += '<img src="http://www.gravatar.com/avatar/' + hash + '" />';
    }
    html += '<strong>' + (comment.email || 'Anonymous') + '</strong>' +
            '<span>' + comment.date.toLocaleDateString() + ' ' + comment.date.toLocaleTimeString() + '</span>' +
            '</div><div>' + comment.text.replace('\n', '<br />') + '</div></li>';

    $(selector + ' > .slp_comment ul').append(html);
  }

  function addThread(selector, comments, show) {
    var html = '<div class="slp_comment" data-slp-id="' + selector + '">' +
      '<div class="slp_token"><span class="slp_count">' + (comments.length || '?') + '</span><div class="slp_popup';

    if(show) html += ' slp_popup_visible';

    html += '"><ul></ul><textarea required placeholder="comment here"></textarea>' +
            '</div></div></div>';

    var el = $(selector);

    el.addClass('slp_commented');
    el.prepend(html);
    el.click(commentClick);
    $(selector + ' > .slp_comment textarea').on('keydown', keydownHandler);

    _.forEach(comments, function(c) { addComment(selector, c); });

    if (show) {
      el.find('.slp_comment textarea').focus();
    }
  };

  _.forEach(window.slapComments, function(value,key) { addThread(key, value, false); });

  function getPath(node) {
    // phase 1: generation
    var path = [];
    while (node) {
      name = node.localName;
      if (!name) break;
      name = name.toLowerCase();

      if (node.id && node.id !== '') {
        path.unshift('#' + node.id);
        break;
      }

      var parent = node.parentElement;
      if (!parent) break;
      if (node.classList.length > 0) {
        for (var i = 0; i < node.classList.length; i++) {
          var className = node.classList[i];
          var sameClassSiblings = [].filter.call(parent.children, function(e) {
            return [].indexOf.call(e.classList, className) > 0;
          });
          if (sameClassSiblings.length == 1) {
            name = '.' + className;
            break;
          }
        }
      } else {
        var sameTagSiblings = [].filter.call(parent.children, function(e) { return e.localName.toLowerCase() == name});
        if (sameTagSiblings.length > 1) {
          allSiblings = parent.children;
          var index = [].indexOf.call(allSiblings, node) + 1;
          if (index > 1) {
              name += ':nth-child(' + index + ')';
          }
        }
      }

      path.unshift(name);
      node = parent;
    }

    // phase 2: simplification
    var results = 0, tempPath, origPath = path.slice(0);;
    for (var i = path.length - 1; i >= 0; i--) {
      // tempPath = path[i] + (tempPath ? '>' + tempPath : '');
      tempPath = path.slice(i).join(' ');
      var newResults = document.querySelectorAll(tempPath).length;
      if (newResults == results) {
        path.splice(i, 1);
      } else {
        results = newResults;
      }
    }
    // simplification failed
    if (results != 1) {
      path = origPath;
    }

    return path.join(' > ');
  }

  $(document).click(function(e) {
    $('.slp_popup').removeClass('slp_popup_visible');

    addThread(getPath(e.target), [], true);
  });
})
