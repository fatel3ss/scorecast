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
	
	var defaultServer = 'http://10.208.115.109:5000';
	var twitchIdValue;
	var currentServerValue;
	
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
		twitchIdValue = item.twitchId;
		$currentTwitchId.textContent = twitchIdValue;
	});
	
	// Get the server address for display
	chrome.storage.sync.get('server', function(item) {
		currentServerValue = item.server;
	
		// Set default server for now if there isn't one
		// TODO: Remove this
		if (!currentServerValue) {
			var storageObject = {};
			storageObject[storageKeys.server] = defaultServer;
			chrome.storage.sync.set(storageObject);
			
			currentServerValue = defaultServer;
		}
		
		$currentServer.textContent = currentServerValue;
	});
	
	
	
	$changeTwitchId.addEventListener('click', function () {
		toggleVisibility($twitchIdControls);
		hideControls($serverControls);
	});
	
	$twitchIdCancel.addEventListener('click', function () {
		toggleVisibility($twitchIdControls);
	});
	
	$changeServer.addEventListener('click', function () {
		toggleVisibility($serverControls);
		hideControls($twitchIdControls);
	});
	
	$serverCancel.addEventListener('click', function () {
		toggleVisibility($serverControls);
	});
	
	// Save the input value by hitting enter
	bindInputKeyupListeners($twitchIdInput, $twitchIdSave, storageKeys.twitchId, $twitchIdControls, $currentTwitchId);
	bindInputKeyupListeners($serverInput, $serverSave, storageKeys.server, $serverControls, $currentServer);
	
	// Bind listeners for Twitch ID and server change buttons
	bindFooterLinkClickListeners($twitchIdSave, storageKeys.twitchId, $twitchIdInput, $twitchIdControls, $currentTwitchId);
	bindFooterLinkClickListeners($serverSave, storageKeys.server, $serverInput, $serverControls, $currentServer);
	
	// Validate and save the input value by hitting enter
	function bindInputKeyupListeners($input, $save, storageKey, $controls, $currentDisplay) {
		$input.addEventListener('keyup', function(evt) {
			if($input.value.length > 0) {
				$save.disabled = false;
				
				if (evt.keyCode === enterKeycode) {
					saveValue(storageKey, $input, $controls, $currentDisplay);
				}
			} else {
				$save.disabled = true;
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
	
	function hideControls(controlElement) {
		controlElement.classList.add('hidden');
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