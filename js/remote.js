angular.module('app', [])
	.run(function ($rootScope, $http){

		$rootScope.next = function (){
			alert('abc');
			window.__socket.emit('send:key', {key: 13})
		}
	})

