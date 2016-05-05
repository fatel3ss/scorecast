var currentLength;
var twitchId;
var server;

// Get the user's twitch ID if they've entered one
chrome.storage.sync.get('twitchId', function(item) {
	twitchId = item.twitchId;
});

// Get the server address
chrome.storage.sync.get('server', function(item) {
	server = item.server;
});

// Listen for changes to the user's twitch ID
chrome.runtime.onMessage.addListener(
	function(request, sender) {
		if (request.twitchId) {
			twitchId = request.twitchId;
		}
		if (request.server) {
			server = request.server;
		}
});

// Send the user's current score every 3 seconds
setInterval(function() {
	if (twitchId) {
		var currentLength = $('span:contains("Your length")').next().text();
		
		if (currentLength) {
			$.ajax({
				url: server + '/score/' + twitchId,
				method: 'PUT',
				contentType:'application/json',
				data: '{"score":' + currentLength + '}'
			});
		}
	}
}, 3000);