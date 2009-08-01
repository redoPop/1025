intervalId = 0;
on = 0;

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
	var text = 'Start. ';
	seconds = 0;
	working = 1;
	if (cycles>0 && cycles%5==0) {
		hours++;
		text += ' Hour ' + (hours+1);
	}
	cycles++;
	say(text);
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
}

function toggle() {
	if (on) stopTimer();
	else startTimer();
	on = Math.abs(on-1);
}
