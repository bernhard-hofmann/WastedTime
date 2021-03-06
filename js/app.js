myStorage = {};
myStorage.setObject = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
myStorage.getObject = function(key) {
    var value = localStorage.getItem(key);
    return value && JSON.parse(value);
}

var APP = (function(module, window, document, undefined) {
	var startTime,
		endTime,
		cumulativeTotalStorageKey = 'TotalTime',
		database = openDatabase("WastedTime", "1.0", "Records time wasted waiting", 2*1024*1024);

	module.EVENT_STARTED_WAITING = '0';
	module.EVENT_WAITING = '1';
	module.EVENT_STOPPED_WAITING = '2';
	module.EVENT_UPDATE_TOTAL = '3';

	module.init = function() {
		$.publish(module.EVENT_UPDATE_TOTAL, [0, myStorage.getObject(cumulativeTotalStorageKey)]);
	};

	module.reset = function() {
		myStorage.setObject(cumulativeTotalStorageKey, 0);
		$.publish(module.EVENT_UPDATE_TOTAL, [0, 0]);
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

		database.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS Wait (StartTime DATETIME, StopTime DATETIME)');
			tx.executeSql('INSERT INTO Wait (StartTime, StopTime) VALUES (?, ?)', [startTime, endTime]);
		});

		$.publish(module.EVENT_STOPPED_WAITING, [durationMs, cumulativeDurationMs]);
	};

	module.cumulativeTotalMs = function() {
		return myStorage.getObject(cumulativeTotalStorageKey);
	};

	module.allWaits = function() {
		var waits = [], len, i, row;
		database.transaction(function (tx) {
			tx.executeSql('SELECT StopTime-StartTime AS "Duration" FROM Wait', [], function (tx, results) {
				len = results.rows.length;
				for (i = 0; i < len; i++) {
					waits.push(results.rows.item(i));
				}
			});
		});
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
			h = Math.floor(durationMs/anHour),
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