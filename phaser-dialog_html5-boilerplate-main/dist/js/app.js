// console.log(Phaser);

import {createDialogEngine} from "./dialogEngine.js";

var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    scene:{
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);


var buttons = [];
var buttonText = [];
var chapterList = [];
var displayedMainText = [];
var responseNumber = 0;

//SCRIPT

var script = 
`
===startFishing===
Start fishing?
+ Yes -> _1stFishing
+ No -> noFishing

===_1stFishing===
You attach some bait to the hook at the end of your line.
You draw your pole back and throw the line quite far.
The baited hook sinks and now we wait. -> _1stFish

===_1stFish===
As you pull the fish out of the water, a single yellow eye facing you, it speaks:
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
+ Yes -> _2ndFishing
+ No -> end

===_2ndFishing===
You bait your hook again and throw the line. 
As you wait for another fish to bite, your thoughts wander. -> _2ndFish

===_2ndFish===
You feel a powerful fish pulling the line deep into the water.
Its pale face appears near the surface.
The line snaps. -> end

===nonRelease===
You decide to keep the fish and put it in your plastic bucket. The fish flops around sadly. -> keepFishing

===noFishing===
You sit by the water and enjoy the landscape. 
Who needs to know what lies under the waves, anyway.

===end===
You walk away from the water. 
...
New Jersey fish are a special kind.
`

function preload(){
    this.load.image('lake', 'assets/lake_hopatcong.jpg');
    // this.load.image('sunfish', 'assets/sunfish.jpg');
    this.load.image('bass', 'assets/largemouth_bass_transparent.png');
    this.load.spritesheet('talkingSunfish', 'assets/talking_sunfish_smaller_with_sad.png', {frameWidth: 640, frameHeight: 480});
    this.load.image('textbox', 'assets/textbox_redrawn.png');
}

function create(){

//BACKGROUND

    var lake = this.add.image(config.width/2, config.height/2, 'lake');
    lake.setScale(1.2);

//STILL SUNFISH

    // sunfish = this.add.image(300, 400, 'sunfish');
    // sunfish.setScale(0.1);
    // sunfish.visible = false;

//STILL BASS

    var bass = this.add.image(config.width/2 + 60, config.height/2 + 120, 'bass');
    bass.setScale(0.2)
    bass.visible = false;

//ANIMATED SUNFISH

    this.anims.create({
        key: "talk",
        frameRate: 2,
        frames: this.anims.generateFrameNumbers("talkingSunfish", {start: 0, end: 1}),
        repeat: -1
    });

    this.anims.create({
        key: "cry",
        frameRate: 2,
        frames: this.anims.generateFrameNumbers("talkingSunfish", {start: 2, end: 6}),
        repeat: 0
    });

    var talkingFish = this.add.sprite (300, 383, "talkingSunfish").setScale(0.7);

    // talkingFish.play("talk");

    talkingFish.visible = false;

//TEXT DISPLAY

    var textOffset = 7;

//FISH MOOD    

    var moodX = 190;
    var moodY = 180;
    var moodWidth = 200;
    var moodHeight = 30;

    var moodBox = this.add.nineslice(
        moodX, moodY,
        "textbox", undefined,
        moodWidth, moodHeight,
        4, 4,
        4, 4
    );

    var mood = this.add.text(
        moodX - moodWidth/2 + textOffset, 
        moodY - moodHeight/2 + textOffset, 
        '', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }
        });
            
    
    moodBox.visible = false;
    mood.visible = false;

    // mood.text = 'FISSSSHHHH';

//MAIN TEXT 

    var mainTextX = config.width/2;
    var mainTextY = 605;
    var mainTextWidth = 400;
    var mainTextHeight = 60;

    var mainTextbox = this.add.nineslice(
        mainTextX, mainTextY,
        "textbox", undefined,
        mainTextWidth, mainTextHeight,
        4, 4,
        4, 4
    );
    
    var mainText = this.add.text(
        mainTextX - mainTextWidth/2 + textOffset, mainTextY - mainTextHeight/2 + textOffset, 
        '', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 390 }
        });
        
    mainTextbox.visible = false;
    mainText.visible = false;
    
//PLAYER ANSWERS - BUTTONS

    var buttonWidth = 300;
    var buttonHeight = 30;
    var buttonX = config.width/2 +50;

    for (let i = 0; i < 3; i++){

        buttons[i] = this.add.nineslice(
            buttonX, mainTextY + 70 + i*40,
            "textbox", undefined,
            buttonWidth, buttonHeight,
            4, 4,
            4, 4
        );

        buttons[i].setInteractive();
        buttons[i].on('pointerdown', function(){
            if(buttons[i].go == "nonRelease"){talkingFishCries()}
            if(buttons[i].go == "_1stRelease"){hideTalkingFish()}
            dialogEngine.goTo(buttons[i].go);
            chapterList.push(buttons[i].go);
            resetButtons();
            responseNumber = 0;
            resetMainText();
        });

        buttonText[i] = this.add.text(
            buttonX - buttonWidth/2 + textOffset, 
            (mainTextY + 70 + i*40) - buttonHeight/2 + textOffset, 
            'option ' + i, 
            { fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#000000',
                align: 'left',
                wordWrap: { width: 350 }, }
        );

        buttons[i].visible = false;
        buttonText[i].visible = false;
    }

    var resetMainText = function(){
        mainText.text = '';
        mainTextbox.visible = false;
        mainText.visible = false;
        displayedMainText = [];
    }

    var resetButtons = function (){
        for (let i = 0; i < buttons.length; i++){
            buttons[i].visible = false;
            buttonText[i].text = '';
            buttonText[i].visible = false;
            chapterList = [];
        }
    }

    var resetMoodBox = function(){
        moodBox.visible = false;
        mood.visible = false;
        mood.text = "";
    }

    var displayMainText = function(data){
        if (displayedMainText.length >= 1){
            if (displayedMainText[displayedMainText.length - 1].go){
                resetMainText();
            }
        }
        displayedMainText.push(data);

        switch(data.go){
            case "_1stFish":
                setTimeout(() => talkingFishTalks(), 4000)
                break;
            case "_2ndFish":
                setTimeout(() => evilBassBasses(), 4000)
                break;
            case "keepFishing":
                hideTalkingFish();
                break;
            case "end":
                hideBass();
                break;
        }
        
        mainTextbox.visible = true;
        mainText.visible = true;
        
        mainText.text += `${data.m}\n`;
    }

    var talkingFishTalks = function(){
        talkingFish.visible = true;
        talkingFish.play("talk");
        moodBox.visible = true;
        mood.visible = true;
        mood.text = "Mood: Desperate";
    }

    var talkingFishCries = function(){
        talkingFish.visible = true;
        talkingFish.play("cry");
        moodBox.visible = true;
        mood.visible = true;
        mood.text = "Mood: Desperate";
    }

    var hideTalkingFish = function(){
        resetMoodBox();
        talkingFish.visible = false;      
    }

    var hideBass = function(){
        resetMoodBox;
        bass.visible = false;
    }

    var evilBassBasses = function(){
        bass.visible = true;
        moodBox.visible = true;
        mood.visible = true;
        mood.text = "Mood: Ruthless";
    }

    var displayResponse = function(data){
        buttonText[responseNumber].text = data.r;
        buttons[responseNumber].go = data.go;

        buttonText[responseNumber].visible = true;
        buttons[responseNumber].visible = true;

        responseNumber ++;
    }

    var dialogEngine = createDialogEngine(script, displayMainText, displayResponse);
    dialogEngine.start();
}

function update(){
}

//NEXT:

//adapt text box size. (height += something...)

// depending on scene, configure mood, animations, speech and answers display

// answer choice triggers scene.

// make bass face a little less transparent and bluer. (use background image and place specifically, transp over that.) Or just overlay image like sunfish.