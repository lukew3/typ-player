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

