(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { initMonkeytype, renderEventMonkeytype } = require("./platformMethods/monkeytype.js");
const { initMinimal, renderMinimal } = require("./platformMethods/minimal.js");

let ttr = {};
let renderList = [];
let lastRenderedIndex = 0;
let running = false;
let pausedIndex = 0;
let pausedTime = 0;

const promptField = document.getElementById("promptField");
const replayContainer = document.getElementById("ttrPlayer_replay");
const playPauseReplayButton = document.getElementById("playPauseButton");
const loadButton = document.getElementById("loadButton");
const metadataTable = document.getElementById("metadataTable");

replayContainer.innerHTML = "";

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
	initMonkeytype(ttr, replayContainer);
	//initMinimal(ttr, replayContainer);
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


},{"./platformMethods/minimal.js":2,"./platformMethods/monkeytype.js":3}],2:[function(require,module,exports){
let replayField;

const initMinimal = (ttr, inReplayField) => {
        //promptField.innerHTML = ttr.metadata.prompt;
        // Maybe have code here that creates the input box
	replayField = inReplayField;
}

const renderEventMinimal = (dataObj, index) => {
        lastRenderedIndex = index;
        if (dataObj[1] == "Shift") {
                return;
        } else if (dataObj[1] == "Backspace") {
                replayField.innerHTML = replayField.innerHTML.slice(0, -1);
        } else {
                replayField.innerHTML += dataObj[1];
        }
}


},{}],3:[function(require,module,exports){
let wordPos = 0;
let charPos = 0;
let replayField; 

const initMonkeytype = (ttr, inReplayField) => {
        wordPos = 0;
        charPos = 0;
	replayField = inReplayField;
        replayField.innerHTML = "";
        ttr.metadata.prompt.split(" ").forEach((item, i) => {
                let x = document.createElement("div");
                x.className = "ttrPlayer_replay_word";
                for (i = 0; i < item.length; i++) {
                        let letter = document.createElement("LETTER");
                        letter.className = "ttrPlayer_replay_letter";
                        letter.innerHTML = item[i];
                        x.appendChild(letter);
                }
                replayField.appendChild(x);
        });
}

const renderEventMonkeytype = (dataObj, index) => {
        lastRenderedIndex = index;
        let activeLetter = replayField.children[wordPos].children[charPos];
        if (dataObj[1] === "Shift") {
                // Ignore shift
                return;
        } else if (dataObj[1] === "Backspace") {
                // On backspace
                if (charPos === 0) {
                        // If at front of word
                        wordPos--;
                        charPos = replayField.children[wordPos].children.length;
                        return;
                } else {
                        charPos--;
                }
                // Set active letter to previous letter
                activeLetter = replayField.children[wordPos].children[charPos];
                if (activeLetter.classList.contains("extra")) {
                        // remove letter if it is an extra
                        activeLetter.remove();
                } else {
                        // clear styling classes
                        activeLetter.className = "ttrPlayer_replay_letter";
                }
        } else if (dataObj[1] === " ") {
                // On space
                wordPos++;
                charPos = 0;
                return;
        } else if (charPos+1 > replayField.children[wordPos].children.length) {
                // Extra letter
                let letter = document.createElement("LETTER");
                letter.className = "ttrPlayer_replay_letter extra";
                letter.innerHTML = dataObj[1];
                replayField.children[wordPos].appendChild(letter);
                charPos++;
        } else if (activeLetter.innerHTML === dataObj[1]) {
                // Correct letter
                activeLetter.classList.add("correct");
                charPos++;
        } else if (activeLetter.innerHTML !== dataObj[1]) {
                // Incorrect letter
                activeLetter.classList.add("incorrect");
                charPos++;
        }
}

module.exports = {
	initMonkeytype,
	renderEventMonkeytype
}

},{}]},{},[1]);
