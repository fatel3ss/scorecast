$(document).on('DOMContentLoaded', function () {
	// DOM ids
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
	
	// Keys ids for local storage
	var storageKeys = {
		twitchId: 'twitchId',
		server: 'server'
	}
	
	var enterKeycode = 13;
	
	var defaultServer = 'http://10.208.115.109:5000';
	var twitchIdValue;
	var currentServerValue;
	
	var $currentTwitchId = $('#' + ids.currentTwitchId);
	var $currentServer = $('#' + ids.currentServer);
	var $changeTwitchId = $('#' + ids.changeTwitchId);
	var $twitchIdControls = $('#' + ids.twitchIdControls);
	var $twitchIdInput = $('#' + ids.twitchIdInput);
	var $twitchIdSave = $('#' + ids.twitchIdSave);
	var $twitchIdCancel = $('#' + ids.twitchIdCancel);
	var $changeServer = $('#' + ids.changeServer);
	var $serverControls = $('#' + ids.serverControls);
	var $serverInput = $('#' + ids.serverInput);
	var $serverSave = $('#' + ids.serverSave);
	var $serverCancel = $('#' + ids.serverCancel);
	
	// Get the user's twitch ID for display
	chrome.storage.sync.get('twitchId', function(item) {
		twitchIdValue = item.twitchId;
		$currentTwitchId.text(twitchIdValue);
	});
	
	// Get the server address for display
	chrome.storage.sync.get('server', function(item) {
		currentServerValue = item.server;
	
		// Set default server for now if there isn't one
		// TODO: Remove this
		if (!currentServerValue) {
			var storageKey = storageKeys.server;
			var storageObject = {};
			storageObject[storageKey] = defaultServer;
			chrome.storage.sync.set(storageObject);
			
			currentServerValue = defaultServer;
			
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				messageObject = {};
				messageObject[storageKey] = value;
				chrome.tabs.sendMessage(tabs[0].id, messageObject);
			});
		}
		
		$currentServer.text(currentServerValue);
	});
	
	$changeTwitchId.on('click', function () {
		toggleVisibility($twitchIdControls);
		hideControls($serverControls);
	});
	
	$twitchIdCancel.on('click', function () {
		toggleVisibility($twitchIdControls);
	});
	
	$changeServer.on('click', function () {
		toggleVisibility($serverControls);
		hideControls($twitchIdControls);
	});
	
	$serverCancel.on('click', function () {
		toggleVisibility($serverControls);
	});
	
	// Save the input value by hitting enter
	bindInputKeyupEvent($twitchIdInput, $twitchIdSave, storageKeys.twitchId, $twitchIdControls, $currentTwitchId);
	bindInputKeyupEvent($serverInput, $serverSave, storageKeys.server, $serverControls, $currentServer);
	
	// Bind listeners for Twitch ID and server change buttons
	bindFooterLinkClickEvent($twitchIdSave, storageKeys.twitchId, $twitchIdInput, $twitchIdControls, $currentTwitchId);
	bindFooterLinkClickEvent($serverSave, storageKeys.server, $serverInput, $serverControls, $currentServer);
	
	// Validate and save the input value by hitting enter
	function bindInputKeyupEvent($input, $save, storageKey, $controls, $currentDisplay) {
		$input.on('keyup', function(evt) {
			if($input.val().length > 0) {
				$save.prop('disabled', false);
				
				if (evt.keyCode === enterKeycode) {
					saveValue(storageKey, $input, $controls, $currentDisplay);
				}
			} else {
				$save.prop('disabled', true);
			}
		});
	}
	
	function bindFooterLinkClickEvent($saveButton, storageKey, $input, $controls, $currentDisplay) {
		$saveButton.on('click', function() {
			saveValue(storageKey, $input, $controls, $currentDisplay);
		});
	}
	
	function saveValue(storageKey, $input, $controls, $currentDisplay) {
		value = $input.val();
		
		$currentDisplay.text(value);
			
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
		if (element.hasClass('hidden')) {
			element.removeClass('hidden');
		} else {
			element.addClass('hidden');
		}
		
		clearInputs();
	}
	
	function hideControls(controlElement) {
		controlElement.addClass('hidden');
	}
	
	// Clear the inputs
	function clearInputs() {
		$twitchIdInput.val('');
		$serverInput.val('');
	}
	
	function closePopup() {
		window.close();
	}
});