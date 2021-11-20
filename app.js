let ttr = {};
let renderList = [];
let lastRenderedIndex = 0;
let running = false;
let pausedIndex = 0;
let pausedTime = 0;

const promptField = document.getElementById("promptField");
const displayField = document.getElementById("displayField");
const playPauseReplayButton = document.getElementById("playPauseButton");
const loadButton = document.getElementById("loadButton");
const metadataTable = document.getElementById("metadataTable");

displayField.value = "";

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
	promptField.innerHTML = ttr.metadata.prompt;
	Object.keys(ttr.metadata).forEach((key) => {
		let tr = document.createElement("tr");
		tr.innerHTML = "<tr><td>" + key + "</td><td>" + ttr.metadata[key] + "</td></tr>";
		metadataTable.appendChild(tr);
	})
}

const initMinimal = () => {
	promptField.innerHTML = ttr.metadata.prompt;
	// Maybe have code here that creates the input box
}

const initMonkeytype = () => {
	
}

const playReplay = () => {
	running = true;
	playPauseReplayButton.innerHTML = "Pause Replay";
	displayField.value = "";
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
	lastRenderedIndex = index;
	if (dataObj[1] == "Shift") {
		return;
	} else if (dataObj[1] == "Backspace") {
		displayField.value = displayField.value.slice(0, -1);
	} else {
		displayField.value += dataObj[1];
	}
}

