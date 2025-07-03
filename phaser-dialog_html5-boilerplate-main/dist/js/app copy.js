// console.log("Hi!")

// var text = "hullo";

// function textToObject(textToConvert){
//     if (textToConvert.includes("->")){
//         var splitText = textToConvert.split("->")
//         var convertedText = {
//             m: splitText[0].trim(),
//             go: splitText[1].trim()
//         }
//     }
//     else{
//         var convertedText = {
//             m: textToConvert.trim()
//         }
//     }
//     return convertedText;
// }

// console.log(textToObject(text));

// var question = "+ A watch? ->watch";

// function questionToObject(questionToConvert){
//     var splitQuestion = questionToConvert.split("->")
//     var convertedQuestion = {
//         q: splitQuestion[0].replace('+', '').trim(), 
//         go: splitQuestion[1].trim()
//     }
//     return convertedQuestion;
// }

// console.log(questionToObject(question));

// var sceneTag = "===watch===";

// function tagToObject(tagToConvert){
    
//     var convertedTag = {
//         s: tagToConvert.slice(3, -3)
//     }
//     return convertedTag;
// }

// console.log(tagToObject(sceneTag));

// function textToList(textToConvert){
//     // console.log(textToConvert);
//     var splitText = textToConvert.split("\n").filter((word) => word.length>0);
//     return splitText;
// }

var script = 
`
===_1stfish===
As you pull the fish ot of the water, a single yellow eye facing you, it speaks:
"I'll answer any question you have, if you release me."
+ (release the fish) -> _1strelease
+ (don't release the fish) -> nonrelease

===_1strelease===
You drop the fish back into the water. It swims in circles, waiting.
+ Why do fish bite when there's no bait? -> message
+ What's in the water? -> water
+ Do fish feel pain? -> fishpain

===message===
"Because the ones who speak want to send a message." -> keepfishing

===water===
"There's a fine green mist near the surface." -> keepfishing

===fishpain===
"Yes."-> keepfishing

===keepfishing===
Keep fishing?
+ Yes -> _2ndfish
+ No -> end

===_2ndfish===
As you wait for another fish to bite, your thoughts wander. You feel a powerful fish pull the line deep into the water. You try to draw it out and preserve your fishing pole. Its pale face appears near the surface.
The line snaps. -> end

===nonrelease===
You decide to keep the fish and put it in your plastic bucket. The fish flops around sadly. -> keepfishing

===end===
You walk away from the water. New Jersey fish are a special kind.
`

// `
// "Hey!"
// "It’s a watch."
// + A watch? ->watch
// + What is it for? ->forWhat
// ===watch===
// "Yeah, it’s a watch. It tells the time."
// "My father gave it to me. Went through hell and back with him"
// + What is it for? ->forWhat
// + can I have it? ->give
// + It's not vey usefull? ->angry
// ===forWhat===
// "It tells time."
// "When to eat, sleep, wake up, work." ->end
// ===give===
// "Sure, take it"
// "I cannot tell the time now" ->end
// ===angry===
// "You are very rude"
// "Go Away" ->end
// ===end===
// END
// `

// var scriptAsList = textToList(rawScript)

// function buildScript(scriptList){
//     var convertedScript = []
//     for (let i = 0; i < scriptList.length; i++){
//         switch (scriptList[i][0]){
//             case '+':
//                 convertedScript.push(questionToObject(scriptList[i]));
//                 break;
//             case '=':
//                 convertedScript.push(tagToObject(scriptList[i]));
//                 break;
//             default:
//                 convertedScript.push(textToObject(scriptList[i]));
//                 break;
//         }
//     }
//     return convertedScript;
// }

// script = buildScript(scriptAsList);

// var anchor = 0;

// for (i = anchor; i < script.length; i++){
//     console.log(script[i]);
//     // if (script[i]['m']){
//     //     displayedText = script[i]['m'];
//     // }
//     if (script[i]['q']){
//         break;
//     }
// }

// var displayedText = "Hi Mom";

// var canvas = document.createElement("canvas");
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// document.body.appendChild(canvas);

// var ctx = canvas.getContext("2d");

// ctx.font = "42px Arial";
// ctx.fillText(displayedText, 100, 100);

var createDialogEngine = function(script, displayMessage, displayQuestion){
    var self = {};
    var storyItems = undefined;

///FORMATTING

    //convert text to list of strings
    var scriptAsList = scriptToList(script)
    function scriptToList(script){
        return script.split("\n").filter((word) => word.length>0);
    }

    //convert list of strings to list of objects
    storyItems = toObject(scriptAsList)
    function toObject(scriptAsList){
        var listOfObjects = [];
        for (let i = 0; i < scriptAsList.length; i++){
            if (scriptAsList[i][0] == '='){ //is a scene
                var formattedText = scriptAsList[i].replace("===", "").replace("===", "");
                listOfObjects.push({s: formattedText});
            } else if (scriptAsList[i][0] == '+'){ //is a question
                var splitQuestion = scriptAsList[i].split("->");
                var formattedQuestion = splitQuestion[0].substring(1).trim();
                listOfObjects.push({q: formattedQuestion, go: splitQuestion[1].trim()});
            } else{ //is a message
                var splitMessage = scriptAsList[i].split("->");
                listOfObjects.push({m: splitMessage[0].trim(), go: splitMessage[1]?.trim()});
            }
        }
        return listOfObjects;
    }

///PROCESSING

    function readStory(storyItems, index){
        if (index == -1){index = 0}
        var i = index;
        // for (let i = anchor; i < storyItems.length; i++){
            // if (storyItems[i].m){
            //     if (displayMessage){
            //         displayMessage(storyItems[i], self);
            //         if (storyItems[i].go){
            //             goTo(storyItems[i].go);
            //             return 'newChapter';
            //         }
            //     }
            // } else if (storyItems[i].q){
            //     if (displayQuestion){
            //         displayQuestion(storyItems[i], self);
            //     }
            // } else if (storyItems[i].s){
            //     return 'waiting for selection';
            // }
        // }

        if (storyItems[i].m){
            if (displayMessage){
                displayMessage(storyItems[i]);
            } if (storyItems[i].go){
                    goTo(storyItems[i].go);
                    return 'newChapter';
            } 
            setTimeout(() => {readStory(storyItems, i+1)}, 800);
        } else if (storyItems[i].q){
            if (displayQuestion){
                displayQuestion(storyItems[i], self);
            }
            setTimeout(() => {readStory(storyItems, i+1)}, 800);
        } else if (storyItems[i].s){
            return 'waiting for selection';
        }


    }

    function start(){
        readStory(storyItems, 1);
    }

    function goTo(anchor){
        readStory(storyItems, findScene(anchor));
    }

    // function addCustomMessage(message){
    //     displayMessage({m: message})
    // }

    function findScene(anchor){
        // return storyItems.map(x => x.s).indexOf(anchor) + 1;
        return storyItems.findIndex(x => x.s === anchor) + 1;
    }

    self.start = start;
    self.goTo = goTo;
    // self.addCustomMessage = addCustomMessage;
    return self;
}

function displayMessage(data){
    // console.log(data);
    var domElement = document.createElement("div");
    domElement.innerHTML = data.m;
    document.body.appendChild(domElement);
}

function displayResponse(response){
    var domElement = document.createElement("div");
    domElement.innerHTML = response;
    domElement.style.color = "seagreen"
    document.body.appendChild(domElement);
}

var currentButtons = [];

function displayQuestion(data, currentDialog){
    // console.log(data);
    var domElement = document.createElement("button");
    currentButtons.push(domElement);
    domElement.innerHTML = data.q;
    domElement.style.backgroundColor = "darkseagreen";
    domElement.style.display = 'block';
    domElement.style.margin = '10px';
    document.body.appendChild(domElement);

    function triggerButton(event){
        // console.log(data);
        // console.log(currentButtons)
        for(let i = 0; i < currentButtons.length; i++){
            currentButtons[i].style.display = "none";
        }
        // currentDialog.addCustomMessage(data.q);
        displayResponse(data.q);

        // alert("button pressed");
        // console.log(currentDialog.goTo);
        currentDialog.goTo(data.go);
    }

    domElement.addEventListener("click", triggerButton);
}

var dialog = createDialogEngine(script, displayMessage, displayQuestion);
dialog.start();
