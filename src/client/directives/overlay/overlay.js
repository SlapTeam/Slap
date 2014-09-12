
(function(slap){

	slap.app.directive('slapOverlay', ['$sce', '$location', function ($sce, $location) {
    	return {
        	restrict: 'E',
        	templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('client/directives/overlay/overlay.html')),
        	scope: {
            	selectedSlap: '=',
							onChange: '='
            },
        	link: function ($scope, element, attrs) {

						var currentUrl = $location.absUrl();

						var threads = {};

						function commentClick(e) {
							var el = $(e.target);

							if (el.closest('.slp_popup').length) {
								e.stopPropagation();
								return;
							}

							if (el.hasClass('slp_commented')) {
								el = el.children('slp_token');
							}

							if (!el.hasClass('slp_token')) el = el.closest('.slp_token');

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

									var date = new Date();

									var comment = {
										email: window.slap.user.email,
										date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
										text: e.target.value
									};

									if (!$scope.selectedSlap.pages)
									{
										$scope.selectedSlap.pages = [];
									}

									var selectors = [];
									if (!_.any($scope.selectedSlap.pages, function(p) { return p.href == currentUrl; }))
									{
										$scope.selectedSlap.pages.push({
											href: currentUrl,
											title: document.title,
											selectors: selectors
										});
									}
									else {
										selectors = _.find($scope.selectedSlap.pages, function(p) { return p.href == currentUrl; }).selectors;
									}

									if (!_.find(selectors, function(s){return s.selector == selector;})) {
										selectors.push({
											selector: selector,
											comments: []
										});
									}
									var comments = _.find(selectors, function(s) { return s.selector == selector }).comments;
									comments.push(comment);
									addComment(selector, comment);
									threads[selector].find('.slp_count').text(comments.length);
									e.target.value = '';
									e.target.blur();
									$scope.onChange($scope.selectedSlap);
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
											'<span>' + (comment.date || '') + '</span>' +
											'</div><div>' + comment.text.replace('\n', '<br />') + '</div></li>';

							threads[selector].find('ul').append(html);
						}

						function addThread(selector, comments, show) {
							var html = '<div class="slp_comment" data-slp-id="' + selector + '">' +
								'<div class="slp_token"><span class="slp_count">' + (comments.length || '?') + '</span><div class="slp_popup';

							if(show) html += ' slp_popup_visible';

							html += '"><ul></ul><textarea required placeholder="comment here"></textarea>' +
											'</div></div></div>';

							var el = $(selector);

							el.addClass('slp_commented');
							var pos = el.offset();
							$(document.body).append(html);
							thread = $(document.body).children().last();
							threads[selector] = thread;
							thread.click(commentClick);
							thread.offset(position(selector));
							el.click(commentClick);
							thread.find('textarea').on('keydown', keydownHandler);

							_.forEach(comments, function(c) { addComment(selector, c); });

							if (show) {
								thread.find('textarea').focus();
							}
						};

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

						function position(selector) {
							var el = $(selector);
							var offset = el.offset();

							return {
								left: offset.left + el.width() / 2,
								top: offset.top
							};
						}

						$(document).click(function(e) {

							if ($(e.target).closest('.slap-ui').length) return;

							$('.slp_popup').removeClass('slp_popup_visible');

						});

						$(window).on('resize', function() {
							_.forEach(threads, function(value, key) {
								value.offset(position(key));
							});
						});

            $scope.$watch('selectedSlap', function(value) {
								if (!value) return;
								if (!value.pages) value.pages = [];
								var pages = _.find($scope.selectedSlap.pages, function(p) { return p.href == currentUrl; });
								if (pages) {
                	_.forEach(pages.selectors, function(value) {
										if (threads[value.selector]) {
											threads[value.selector].find('li').remove();
											_.forEach(value.comments, function(c) {
												addComment(value.selector, c);
											});
										}
										else addThread(value.selector, value.comments, false);
									});
								}
            }, true);

						function addClickHandler(e) {
							if ($(e.target).closest('.slap-ui').length) return;

							addThread(getPath(e.target), [], true);
							e.preventDefault();
							$(document).off('click', addClickHandler);
							$scope.addingComment = false;
							$scope.$apply();
						};

						$scope.addingComment = false;
						$scope.addComment = function() {
							$scope.addingComment = true;
							$(document).on('click', addClickHandler);
						};
        	}
    	};
	}]);


}(window.slap));
