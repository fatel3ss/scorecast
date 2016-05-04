var currentLength;
var twitchId;

// Get the user's twitch ID if they've entered one
chrome.storage.sync.get('twitchId', function(item) {
	twitchId = item.twitchId;
});

// Listen for changes to the user's twitch ID
chrome.runtime.onMessage.addListener(
	function(request, sender) {
		twitchId = request.twitchId;
});

// Send the user's current score every 3 seconds
setInterval(function() {
	if (twitchId) {
		var currentLength = $('span:contains("Your length")').next().text();
		
		if (currentLength) {
			$.ajax({
				url: 'http://10.208.115.109:5000/score/' + twitchId,
				method: 'PUT',
				contentType:'application/json',
				data: '{"score":' + currentLength + '}'
			});
		}
	}
}, 3000);