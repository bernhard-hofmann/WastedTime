$(document).ready(function () {
	test("Duration of 0 ms.", function () {
		var result = APP.prettyPrintDuration(0);
		equals(result, "0ms");
	});

	test("Duration of 500 ms.", function () {
		var result = APP.prettyPrintDuration(500);
		equals(result, "500ms");
	});

	test("Duration of 1s.", function () {
		var result = APP.prettyPrintDuration(1000);
		equals(result, "1 second");
	});

	test("Duration of 1500 ms.", function () {
		var result = APP.prettyPrintDuration(1500);
		equals(result, "1 second 500ms");
	});

	test("Duration of 5s.", function () {
		var result = APP.prettyPrintDuration(5000);
		equals(result, "5 seconds");
	});

	test("Duration of 59s.", function () {
		var result = APP.prettyPrintDuration(59*1000);
		equals(result, "59 seconds");
	});

	test("Duration of 60s.", function () {
		var result = APP.prettyPrintDuration(60*1000);
		equals(result, "1 minute");
	});

	test("Duration of 61s.", function () {
		var result = APP.prettyPrintDuration(61*1000);
		equals(result, "1 minute 1 second");
	});

	test("Duration of 62s.", function () {
		var result = APP.prettyPrintDuration(62*1000);
		equals(result, "1 minute 2 seconds");
	});

	test("Duration of 123.5s.", function () {
		var result = APP.prettyPrintDuration(123*1000 + 500);
		equals(result, "2 minutes 3 seconds");
	});

	test("Duration of 1h 8m 7s.", function () {
		var result = APP.prettyPrintDuration( (1*60*60 + 8*60 + 7)*1000);
		equals(result, "1 hour 8 minutes 7 seconds");
	});

	test("Duration of 2706425 ms", function () {
		var result = APP.prettyPrintDuration(2706425);
		equals(result, "45 minutes 6 seconds");
	});
});