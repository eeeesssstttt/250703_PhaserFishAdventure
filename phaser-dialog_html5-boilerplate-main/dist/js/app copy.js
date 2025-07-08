var script = 
`
===startFishing===
Start fishing?
+ Yes -> _1stFish
+ No -> noFishing

===_1stFish===
As you pull the fish ot of the water, a single yellow eye facing you, it speaks:
"I'll answer any question you have, if you release me."
+ (release the fish) -> _1stRelease
+ (don't release the fish) -> nonRelease

===_1stRelease===
You drop the fish back into the water. It swims in circles, waiting.
+ Why do fish bite when there's no bait? -> message
+ What's in the water? -> water
+ Do fish feel pain? -> fishPain

===message===
"Because the ones who speak want to send a message." -> keepFishing

===water===
"There's a fine green mist near the surface." -> keepFishing

===fishPain===
"Yes." -> keepFishing

===keepFishing===
Keep fishing?
+ Yes -> _2ndFish
+ No -> end

===_2ndFish===
As you wait for another fish to bite, your thoughts wander. You feel a powerful fish pull the line deep into the water. You try to draw it out and preserve your fishing pole. Its pale face appears near the surface.
The line snaps. -> end

===nonRelease===
You decide to keep the fish and put it in your plastic bucket. The fish flops around sadly. -> keepFishing

===noFishing===
You sit by the water and enjoy the landscape. Who needs to know what lies under the waves?

===end===
You walk away from the water. New Jersey fish are a special kind.
`
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
                displayMainText(story[i]);
            } if (story[i].go){
                    goTo(story[i].go);
                    return 'newChapter';
            } 
            setTimeout(() => {readStory(story, i+1)}, 800);
        } else if (story[i].r){
            if (displayResponse){
                displayResponse(story[i], self);
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

function displayMainText(data){
    var domElement = document.createElement("div");
    domElement.innerHTML = data.m;
    document.body.appendChild(domElement);
}

var currentButtons = [];

function displayResponse(data, currentDialog){
    var domElement = document.createElement("button");
    currentButtons.push(domElement);
    domElement.innerHTML = data.r;
    domElement.style.backgroundColor = "darkseagreen";
    domElement.style.display = 'block';
    domElement.style.margin = '10px';
    document.body.appendChild(domElement);

    function triggerButton(event){
        for(let i = 0; i < currentButtons.length; i++){
            currentButtons[i].style.display = "none";
        }
        // currentDialog.addCustomMessage(data.r);
        displayResponse(data.r);

        currentDialog.goTo(data.go);
    }

    domElement.addEventListener("click", triggerButton);
}

var dialog = createDialogEngine(script, displayMainText, displayResponse);
dialog.start();