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
