const { initMonkeytype, renderEventMonkeytype } = require("./platformMethods/monkeytype.js");
const { initMinimal, renderMinimal } = require("./platformMethods/minimal.js");

let ttr = {};
let renderList = [];
let lastRenderedIndex = 0;
let running = false;
let pausedIndex = 0;
let pausedTime = 0;

const promptField = document.getElementById("promptField");
const replayField = document.getElementById("ttrPlayer_replay");
const playPauseReplayButton = document.getElementById("playPauseButton");
const loadButton = document.getElementById("loadButton");
const metadataTable = document.getElementById("metadataTable");

replayField.innerHTML = "";

loadButton.addEventListener("click", (event) => {
	let file = document.getElementById("fileInput").files[0];
	if (!file) return;
	let fr = new FileReader();
	fr.onload = (event) => {
		let lines = event.target.result;
		ttr = JSON.parse(lines);
		initReplay();
	}
	fr.readAsText(file);
});

playPauseReplayButton.addEventListener("click", (event) => {
	if (running) pauseReplay();
	else playReplay();
});

const initReplay = () => {
	initTable();
	initDisplay();
}

const initTable = () => {
	Object.keys(ttr.metadata).forEach((key) => {
		let tr = document.createElement("tr");
		tr.innerHTML = "<tr><td>" + key + "</td><td>" + ttr.metadata[key] + "</td></tr>";
		metadataTable.appendChild(tr);
	});
}

const initDisplay = () => {
	initMonkeytype(ttr, replayField);
	//initMinimal(ttr, replayField);
}

const playReplay = () => {
	running = true;
	playPauseReplayButton.innerHTML = "Pause Replay";
	initDisplay();
	ttr.data.forEach((item, index) => {
		if (index <= pausedIndex) {
			renderEvent(item, index);
		} else {
			renderList.push(
				setTimeout(() => {
					renderEvent(item, index);
				}, item[0] - pausedTime)
			);
		}
	});
	renderList.push(
		setTimeout(() => {
			playPauseReplayButton.innerHTML = "Play Replay";
			pausedIndex = 0;
			pausedTime = 0;
			renderList = [];
			running = false;
		}, ttr.data[ttr.data.length - 1][0] - pausedTime)
	);
}

const pauseReplay = () => {
	running = false;
	pausedIndex = lastRenderedIndex;
	pausedTime = ttr.data[lastRenderedIndex][0];
	playPauseReplayButton.innerHTML = "Resume Replay";
	renderList.forEach((item) => {
		clearTimeout(item);
	});
	renderList = [];
}

const renderEvent = (dataObj, index) => {
	// change next line to suit your desired style
	//renderEventMinimal(dataObj, index);
	renderEventMonkeytype(dataObj, index);
}

