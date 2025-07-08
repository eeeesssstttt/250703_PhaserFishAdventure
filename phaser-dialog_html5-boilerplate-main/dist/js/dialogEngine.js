export var createDialogEngine = function(script, displayMainText, displayResponse){
    var self = {};
    var story = undefined;

    //FORMATTING

    //convert text to list of strings
    var scriptList = scriptToList(script)
    function scriptToList(script){
        return script.split("\n").filter((word) => word.length>0);
    }

    //convert list of strings to list of objects
    story = toObject(scriptList)
    function toObject(scriptList){
        var listOfObjects = [];
        for (let i = 0; i < scriptList.length; i++){
            if (scriptList[i][0] == '='){ //is a scene
                var formattedText = scriptList[i].replace("===", "").replace("===", "");
                listOfObjects.push({s: formattedText});
            } else if (scriptList[i][0] == '+'){ //is a response
                var splitResponse = scriptList[i].split("->");
                var formattedResponse = splitResponse[0].substring(1).trim();
                listOfObjects.push({r: formattedResponse, go: splitResponse[1].trim()});
            } else{ //is main text
                var splitMainText = scriptList[i].split("->");
                listOfObjects.push({m: splitMainText[0].trim(), go: splitMainText[1]?.trim()});
            }
        }
        return listOfObjects;
    }

    //PROCESSING

    function readStory(story, index){
        if (index == -1){index = 0}
        var i = index;

        if (story[i].m){
            if (displayMainText){
                setTimeout(() => displayMainText(story[i]), 800);
            } if (story[i].go){
                    setTimeout(() => goTo(story[i].go), 4000);
                    return 'newChapter';
            } 
            setTimeout(() => {readStory(story, i+1)}, 800);
        } else if (story[i].r){
            if (displayResponse){
                setTimeout(() => displayResponse(story[i], self), 800);
            }
            setTimeout(() => {readStory(story, i+1)}, 800);
        } else if (story[i].s){
            return 'waiting for selection';
        }


    }

    function start(){
        readStory(story, 1);
    }

    function goTo(anchor){
        readStory(story, findScene(anchor));
    }

    // function addCustomMessage(message){
    //     displayMessage({m: message})
    // }

    function findScene(anchor){
        return story.findIndex(x => x.s === anchor) + 1;
    }

    self.start = start;
    self.goTo = goTo;
    // self.addCustomMessage = addCustomMessage;
    return self;
}

// function displayMainText(data){
//     var domElement = document.createElement("div");
//     domElement.innerHTML = data.m;
//     document.body.appendChild(domElement);
// }

// var currentButtons = [];

// function displayResponse(data, currentDialog){
//     var domElement = document.createElement("button");
//     currentButtons.push(domElement);
//     domElement.innerHTML = data.r;
//     domElement.style.backgroundColor = "darkseagreen";
//     domElement.style.display = 'block';
//     domElement.style.margin = '10px';
//     document.body.appendChild(domElement);

//     function triggerButton(event){
//         for(let i = 0; i < currentButtons.length; i++){
//             currentButtons[i].style.display = "none";
//         }
//         // currentDialog.addCustomMessage(data.r);
//         displayResponse(data.r);

//         currentDialog.goTo(data.go);
//     }

//     domElement.addEventListener("click", triggerButton);
// }

// var dialog = createDialogEngine(script, displayMainText, displayResponse);
// dialog.start();