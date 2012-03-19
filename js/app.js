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

	module.debug = function() {
		var cumulativeDurationMs;
		cumulativeDurationMs = myStorage.getObject(cumulativeTotalStorageKey);
		window.alert('The cumulative total wait time is '+ cumulativeDurationMs +'ms');
	};

	// TODO: Support more than minutes in the duration.
	module.prettyPrintDuration = function(durationMs) {
		var
			aMinute = 60*1000,
			anHour = 60*60*1000,
			aDay = 24*60*60*1000,
			ms = durationMs,
			s = Math.floor(durationMs/1000),
			m = Math.floor(durationMs/aMinute),
			h = Math.round(durationMs/anHour),
			d = Math.floor(h/aDay),
			result = '';

		if (durationMs < 1000) {
			return durationMs +'ms';
		}

		ms -= s*1000;
		s -= m*60;
		m -= h*60;

		if (d > 0) {
			result += ' '+ d +' day'+ (d===1?'':'s');
		}
		if (h > 0 || durationMs > aDay) {
			result += ' '+ h +' hour'+ (h===1?'':'s');
		}
		if (m > 0 || durationMs > anHour) {
			result += ' '+ m +' minute'+ (m===1?'':'s');
		}
		if (s > 0 || durationMs > aMinute) {
			result += ' '+ s +' second'+ (s===1?'':'s');
		}
		if (durationMs < aMinute && ms > 0) {
			result += ' '+ ms +'ms';
		}

		return result.replace('  ',' ','g').trim();
	};

	return module;
}(APP || {}, window, document));