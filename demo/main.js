let ttr = {};
let renderList = [];

const promptField = document.getElementById("promptField");
const displayField = document.getElementById("displayField");
const playReplayButton = document.getElementById("playButton");
const loadButton = document.getElementById("loadButton");
const stopButton = document.getElementById("stopButton");
const metadataTable = document.getElementById("metadataTable");

displayField.value = "";

loadButton.addEventListener("click", (event) => {
	let file = document.getElementById("fileInput").files[0];
	if (!file) return;
	let fr = new FileReader();
	fr.onload = (event) => {
		let lines = event.target.result;
		ttr = JSON.parse(lines);
		console.log(ttr);
		initReplay();
	}
	fr.readAsText(file);
});

playReplayButton.addEventListener("click", (event) => {
	runReplay();
});

stopButton.addEventListener("click", (event) => {
	stopReplay();
});

function initReplay() {
	promptField.innerHTML = ttr.metadata.prompt;
	Object.keys(ttr.metadata).forEach((key) => {
		let tr = document.createElement("tr");
		tr.innerHTML = "<tr><td>" + key + "</td><td>" + ttr.metadata[key] + "</td></tr>";
		metadataTable.appendChild(tr);
	})
}

function runReplay() {
	displayField.value = "";
	ttr.data.forEach((item, i) => {
		renderList.push(
			setTimeout(() => {
				renderEvent(item);
			}, item[0])
		);
	});
}

function stopReplay() {
	renderList.forEach((item) => {
		clearTimeout(item);
	});
	renderList = [];
}

function renderEvent(dataObj) {
	if (dataObj[1] == "Shift") {
		return;
	} else if (dataObj[1] == "Backspace") {
		displayField.value = displayField.value.slice(0, -1);
	} else {
		displayField.value += dataObj[1];
	}
}

