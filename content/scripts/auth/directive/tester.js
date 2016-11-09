module.exports =function (res, api) {
	var list = [ 'isLoadings', 'isUnique' ];
	return {
		require: 'ngModel',
		link: function ($scope, ele, attrs, ngModel) {
			function check (my) {
				var data = false;
				ngModel.$setValidity(list[0], angular.isObject(my));
				if( my ) data = !!my.unique;
				ngModel.$setValidity(list[1], data);
			}

			ngModel.$parsers.push(function (value) {
				check();

				if( !value || value.length === 0 )
					return value;

				res({
					url: api + 'test/' + attrs.isUnique,
					method: 'POST',
					data: {
						field : value
					},
					withCredentials: true,
				}).success(check).error(check);
				return value;
			});
		}
	};
};

module.exports.$inject = ['$http', 'API'];
