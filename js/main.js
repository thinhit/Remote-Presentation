angular.module('app', [])
	.run(function ($rootScope, Utils, HttpRoutes){
		var robot = require("robotjs");
		var express = require('express');
		var app 	= express();

		app.use(express.static('public'));
	
		app.get('/', HttpRoutes.home);

		

		var server = app.listen(3004, function (){
			$rootScope.$apply(function (){
				$rootScope.msg = "Server running";
			})
		})

		var io = require('socket.io')(server);

		io.on('connection', function (socket){
			console.log('new socket connect', server)
			socket.on('send:key', function (data){
				console.log('send_key');
				//robot.typeString("Hello World");
				robot.keyTap("enter");
			})	
		})




		

		$rootScope.networkChange = function (ip){
			document.getElementById("qrcode").innerHTML = "";
			if(ip && ip != ""){
				new QRCode(document.getElementById("qrcode"), "http://"+ip+":3004");
			}
		}
		
		$rootScope.list_networks = Utils.getNetworkInterfaces(true);
		$rootScope.$apply(function (){
			$rootScope.frm 			 = Utils.getNetworkInterfaces();
			$rootScope.networkChange($rootScope.frm);
		})
		
		

		



		/*$rootScope.os  = require('os').getNetworkInterfaces();
		//Type "Hello World" then press enter.
		var robot = require("robotjs");
		//Type "Hello World".
		robot.typeString("Hello World");
		//Press enter. 
		robot.keyTap("enter");

		$rootScope.msg = "This is angular application";*/

	})


	.service('HttpRoutes', ['$http', function ($http){
		this.home = function(req, res){
			var fs = require('fs');
			fs.readFile('remote.html', 'utf8', function(err, text){
		        res.send(text);
		    });
		}


	}])
	.service('Utils', ['$http', function ($http){
		this.getNetworkInterfaces = function(list){
			var interfaces 	= require('os').networkInterfaces();
			var _ret 		= {};

			for (var devName in interfaces) {
			    var iface = interfaces[devName];
			    for (var i = 0; i < iface.length; i++) {
				    var alias = iface[i];
				    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				    	if(list)
			        		_ret[devName] = alias.address;
			        	else 
			        		return alias.address;
			    }
			}
			if(list)
				return _ret;
			else 
				return "0.0.0.0"
		}


	}])
