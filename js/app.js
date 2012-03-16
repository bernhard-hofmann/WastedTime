myStorage = {};
myStorage.setObject = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
myStorage.getObject = function(key) {
    var value = localStorage.getItem(key);
    return value && JSON.parse(value);
}

var APP = (function(module, window, document, undefined) {
	var startTime, endTime, cumulativeTotalStorageKey = 'TotalTime';

	module.EVENT_STARTED_WAITING = '0';
	module.EVENT_WAITING = '1';
	module.EVENT_STOPPED_WAITING = '2';

	module.init = function() {
		$.publish(module.EVENT_STOPPED_WAITING, [0, myStorage.getObject(cumulativeTotalStorageKey)]);
	};

	module.reset = function() {
		myStorage.setObject(cumulativeTotalStorageKey, 0);
		$.publish(module.EVENT_STOPPED_WAITING, [0, 0]);
	};

	module.start = function() {
		startTime = new Date();
		endTime = new Date();
		$.publish(module.EVENT_STARTED_WAITING, startTime);
	};

	module.stop = function() {
		var durationMs, cumulativeDurationMs;
		endTime = new Date();
		durationMs = (endTime-startTime);

		// Add to cumulative total in storage
		cumulativeDurationMs = myStorage.getObject(cumulativeTotalStorageKey);
		cumulativeDurationMs += durationMs;
		myStorage.setObject(cumulativeTotalStorageKey, cumulativeDurationMs);

		$.publish(module.EVENT_STOPPED_WAITING, [durationMs, cumulativeDurationMs]);
	};

	module.prettyPrintDuration = function(durationMs) {
		var s = durationMs/1000, m = Math.floor(s/60);
		s = Math.round(s - (m*60));
		return m +' minutes '+ s +' seconds';
	};

	return module;
}(APP || {}, window, document));