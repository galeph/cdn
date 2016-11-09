module.exports =function (loco, win){
	var share = {
		'fb' : {
			icon : 'facebook',
			link : function () {
				return 'http://www.facebook.com/sharer.php?u=' + loco.absUrl();
			}
		},
		twitter : {
			icon : 'twitter',
			link : function (text, via) {
				return 'http://twitter.com/share?text=' + text + '&url=' + loco.absUrl() + '&via=' + via;
			}
		},
		google : {
			icon : 'google-plus',
			link : function () {
				return 'https://plus.google.com/share?url='+ loco.absUrl();
			}
		},
		tumblr : {
			icon : 'tumblr',
			link : function () {
				return 'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&url=' + loco.absUrl();
			}
		},
		reddit : {
			icon : 'reddit',
			link : function () {
				return 'https://www.reddit.com/submit?url=' + loco.absUrl();
			}
		},
		linkedin : {
			icon : 'linkedin',
			link : function () {
				return 'https://www.linkedin.com/shareArticle?mini=true&url=' + loco.absUrl();
			}
		},
		pinterest : {
			icon : 'pinterest',
			link : function (text) {
				return 'http://pinterest.com/pin/create/button/?url=' + loco.absUrl() + '&description=' + text;
			}
		},

		xing : {
			icon : 'xing',
			link : function () {
				return 'https://www.xing-share.com/app/user?op=share;sc_p=xing-share;url=' + loco.absUrl();
			}
		},
		email : {
			icon : 'envelope-o',
			link : function (text) {
				return 'mailto:?subject=' + text + '&body=' + loco.absUrl();
			}
		},
		vk : {
			icon : 'vk',
			link : function (text) {
				return 'http://vkontakte.ru/share.php?url=' + loco.absUrl() + '&title=' + text;
			}
		}
	};

	return {
		restrict: 'A',
		scope: {
			share : '@'
		},
		bindToController: true,
		link : function (scope, ele, attr) {
			scope.tos = share[ scope.share ];
			ele.on('click', function (e) {
				var left = (screen.width/2)- 300;
				var top = (screen.height/2)- 200;
				var newwindow = win.open(scope.tos.link( attr.text, attr.via ),'Share Galeph','location=1,status=1,scrollbars=1,height=400,width=600,top='+top+',left='+left);
				if (win.focus) newwindow.focus();
			});
		},
		template : '<i class="icon icon-{{tos.icon}} icon-lg"></i>',
	};
};

module.exports.$inject = [ '$location', '$window' ];
