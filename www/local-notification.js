document.addEventListener("deviceready", function() {
	var ID_NOTIFICATION_1 = 1;
	
	$(document).on("click", "#showNotification1", function() {
		cordova.plugins.notification.local.schedule({
			id : ID_NOTIFICATION_1,
			title : "Notification 1 Title",
			text : "Notification Text",
			led : "FF0000",
			badge : 1
		});
	});
	
	cordova.plugins.notification.local.on("click", function(notification) {
		alert("Notification clicked! (Id: " + notification.id + ")");
	});
}, false); 