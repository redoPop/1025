intervalId = 0, on = 0;

function count() {
	seconds++;
	if (seconds==600) stopWork();
	else if (seconds==720) startWork();
	countdown();
}

function countdown() {
	if (working) {
		var text = 'Work ';
		var time = 600-seconds;
	} else {
		var text = 'Play ';
		var time = 720-seconds;
	}
	
	// Draw the clocck
	var clockMins = Math.floor(time/60).toString();
	var clockSecs = (time%60).toString();
	if (clockSecs.length<2) clockSecs = '0'+clockSecs;
	text += clockMins+':'+clockSecs;
	state(text);
}

function growl(title, body) {
	setTimeout(function() {
		widget.system('growl-enabled.sh', function (obj) {
			var cmd;
			if (+obj.outputString > 0) {
				cmd = '/usr/bin/osascript growl-notify.scpt "'+title+'" "(10+2)5" "Dashboard" "'+title+'" "'+body+'"';
				widget.system(cmd, function (obj) {});
			}
		});
	}, 1);
}

function init() {
	if (window.widget) createGenericButton(document.getElementById('start'), '(10+2)5', punch);
}

function punch() {
	if (on && working) {
		seconds = 599;
		count();
	} else toggle();
}

function say(text) {
	setTimeout(function() {
		widget.system('/usr/bin/say '+text, null)
	}, 1);
}

function startTimer() {
	hours = 0;
	seconds = 0;
	cycles = 0;
	startWork();
	countdown();
	intervalId = setInterval(count, 1000);
}

function startWork() {
	seconds = 0;
	working = 1;

	var notifyHour = 0;
	if (cycles>0 && cycles%5==0) {
		hours++;
		var notifyHour = (hours+1);
	}
	cycles++;

	say('Start. ' + (notifyHour>0 ? 'Hour '+notifyHour : ''));
	growl('Start Work', 'Start working.' + (notifyHour>0 ? "\rHours: "+notifyHour : ''));
}

function state(text) {
	document.getElementById('status').firstChild.data = text
}

function stopTimer() {
	clearInterval(intervalId);
	say('Stop');
	state('Idle');
}

function stopWork() {
	working = 0;
	say('Stop');
	growl('Stop Work', 'Stop working.');
}

function toggle() {
	if (on) stopTimer();
	else startTimer();
	on = Math.abs(on-1);
}
