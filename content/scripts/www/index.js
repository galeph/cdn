window[require('api').file]
	.service('prop',		require('../api/service/prop.js'))
	.service('socket',		require('../api/service/socket.js'))
	.filter('links',		require('../www/filter/links.js'))
	.filter('max',			require('../www/filter/max.js'))
	.directive('alert',		require('../api/directive/alert.js'))
	.directive('feedback',	require('../glph/directive/feed.js'))
	.directive('follow',	require('../glph/directive/follow.js'))
	.directive('inValue',	require('../api/directive/value.js'))
	.directive('isUnique',	require('../auth/directive/tester.js'))
	.directive('mailActive',require('../www/directive/activeMail.js'))
	.directive('meFocus',	require('../glph/directive/focus.js'))
	.directive('ngEvent',	require('../api/directive/event.js'))
	.directive('ngIcon',	require('../api/directive/icon.js'))
	.directive('ngId',		require('../www/directive/ngId.js'))
	.directive('ngProgress',require('../api/directive/progress.js'))
	.directive('ngTabs',	require('../www/directive/tabs.js'))
	.directive('ngToster',	require('../api/directive/toast.js'))
	.directive('rePass',	require('../auth/directive/repass.js'))
	.directive('right',		require('../api/directive/resize.js'))
	.controller('Cart',		require('../shop/controller/baucher.js'))
	.controller('Commets',	require('../glph/controller/comment.js'))
	.controller('follow', 	require('../glph/controller/follow.js'))
	.controller('item', 	require('../glph/controller/item.js'))
	.controller('Crtl',		require('../api/controller/master.js'))
	.controller('Setting',	require('../www/controller/setting.js'))
	.config(require('./config.js'))
	.run(require('../api/service/run.js'));