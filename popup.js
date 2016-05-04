document.addEventListener('DOMContentLoaded', function () {
	var ids = {
		currentTwitchId: 'currentTwitchId',
		currentServer: 'currentServer',
		changeTwitchId: 'changeTwitchId',
		twitchIdControls: 'twitchIdControls',
		twitchIdInput: 'twitchIdInput',
		twitchIdSave: 'twitchIdSave',
		twitchIdCancel: 'twitchIdCancel',
		changeServer: 'changeServer',
		serverControls: 'serverControls',
		serverInput: 'serverInput',
		serverSave: 'serverSave',
		serverCancel: 'serverCancel',
	}
	
	var storageKeys = {
		twitchId: 'twitchId',
		server: 'server'
	}
	
	var enterKeycode = 13;
	
	//var server = 'http://10.208.115.109:5000';
	var twitchIdValue;
	
	var $currentTwitchId = document.getElementById(ids.currentTwitchId);
	var $currentServer = document.getElementById(ids.currentServer);
	var $changeTwitchId = document.getElementById(ids.changeTwitchId);
	var $twitchIdControls = document.getElementById(ids.twitchIdControls);
	var $twitchIdInput = document.getElementById(ids.twitchIdInput);
	var $twitchIdSave = document.getElementById(ids.twitchIdSave);
	var $twitchIdCancel = document.getElementById(ids.twitchIdCancel);
	var $changeServer = document.getElementById(ids.changeServer);
	var $serverControls = document.getElementById(ids.serverControls);
	var $serverInput = document.getElementById(ids.serverInput);
	var $serverSave = document.getElementById(ids.serverSave);
	var $serverCancel = document.getElementById(ids.serverCancel);
	
	// Get the user's twitch ID for display
	chrome.storage.sync.get('twitchId', function(item) {
		$currentTwitchId.textContent = item.twitchId;
	});
	
	// Get the server address for display
	chrome.storage.sync.get('server', function(item) {
		$currentServer.textContent = item.server;
	});
	
	$changeTwitchId.addEventListener('click', function () {
		toggleVisibility($twitchIdControls);
	});
	
	$twitchIdCancel.addEventListener('click', function () {
		toggleVisibility($twitchIdControls);
	});
	
	$changeServer.addEventListener('click', function () {
		toggleVisibility($serverControls);
	});
	
	$serverCancel.addEventListener('click', function () {
		toggleVisibility($serverControls);
	});
	
	// Save the input value by hitting enter
	bindInputKeyupListeners($twitchIdInput, storageKeys.twitchId, $twitchIdControls, $currentTwitchId);
	bindInputKeyupListeners($serverInput, storageKeys.server, $serverControls, $currentServer);
	
	// Bind listeners for Twitch ID and server change buttons
	bindFooterLinkClickListeners($twitchIdSave, storageKeys.twitchId, $twitchIdInput, $twitchIdControls, $currentTwitchId);
	bindFooterLinkClickListeners($serverSave, storageKeys.server, $serverInput, $serverControls, $currentServer);
	
	// Save the input value by hitting enter
	function bindInputKeyupListeners($input, storageKey, $controls, $currentDisplay) {
		$input.addEventListener('keyup', function(evt) {
			if (evt.keyCode === enterKeycode) {
				saveValue(storageKey, $input, $controls, $currentDisplay);
			}
		});
	}
	
	function bindFooterLinkClickListeners($saveButton, storageKey, $input, $controls, $currentDisplay) {
		$saveButton.addEventListener('click', function() {
			saveValue(storageKey, $input, $controls, $currentDisplay);
		});
	}
	
	function saveValue(storageKey, $input, $controls, $currentDisplay) {
		value = $input.value;
		
		$currentDisplay.textContent = value;
			
		// Clear the storage
		chrome.storage.sync.remove(storageKey);
		
		// Save to storage
		var storageObject = {};
		storageObject[storageKey] = value;
		chrome.storage.sync.set(storageObject);
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			messageObject = {};
			messageObject[storageKey] = value;
			chrome.tabs.sendMessage(tabs[0].id, messageObject);
		});
		
		toggleVisibility($controls);
	}
	
	// Show/hide the input controls and clear them
	function toggleVisibility(element) {
		if (element.classList.contains('hidden')) {
			element.classList.remove('hidden');
		} else {
			element.classList.add('hidden');
		}
		
		clearInputs();
	}
	
	// Clear the inputs
	function clearInputs() {
		$twitchIdInput.value = '';
		$serverInput.value = '';
	}
	
	function closePopup() {
		window.close();
	}
});