window[require('api').file]
	.filter('links',		require('../www/filter/links.js'))
	.filter('max',			require('../www/filter/max.js'))
	.service('socket',		require('../api/service/socket.js'))	
	.service('prop',		require('../api/service/prop.js'))
	.directive('alert',		require('../api/directive/alert.js'))
	.directive('background',require('../glph/directive/background.js'))
	.directive('feedback',	require('../glph/directive/feed.js'))
	.directive('follow',	require('../glph/directive/follow.js'))
	.directive('goNow',		require('../api/directive/goNow.js'))
	.directive('iconEdit',	require('../glph/directive/edit.js'))
	.directive('inValue',	require('../api/directive/value.js'))
	.directive('meFocus',	require('../glph/directive/focus.js'))
	.directive('ngEvent',	require('../api/directive/event.js'))
	.directive('ngIcon',	require('../api/directive/icon.js'))
	.directive('ngId',		require('../www/directive/ngId.js'))
	.directive('ngToster',	require('../api/directive/toast.js'))
	.directive('right',		require('../api/directive/resize.js'))
	.directive('share',		require('../glph/directive/share.js'))
	.directive('trash',		require('../glph/directive/trash.js'))
	.controller('item',		require('../glph/controller/item.js'))
	.controller('follow',	require('../glph/controller/follow.js'))
	.controller('Commets',	require('../glph/controller/comment.js'))
	.controller('Setting',	require('../www/controller/setting.js'))
	.controller('Crtl',		require('../api/controller/master.js'))
	.config(require('./config.js'))
	.run(require('../api/service/run.js'));