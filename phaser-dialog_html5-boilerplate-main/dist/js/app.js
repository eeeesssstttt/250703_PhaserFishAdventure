// console.log(Phaser);

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

function preload(){
    this.load.image('lake', 'assets/lake_hopatcong.jpg');
    // this.load.image('sunfish', 'assets/sunfish.jpg');
    this.load.image('bass', 'assets/largemouth_bass_transparent.png');
    this.load.spritesheet('talking_sunfish', 'assets/talking_sunfish_smaller_with_sad.png', {frameWidth: 640, frameHeight: 480});
    this.load.image('textbox', 'assets/textbox_redrawn.png');
}

function create(){

// BACKGROUND

    lake = this.add.image(config.width/2, config.height/2, 'lake');
    lake.setScale(1.2);

// STILL SUNFISH

    // sunfish = this.add.image(300, 400, 'sunfish');
    // sunfish.setScale(0.1);
    // sunfish.visible = false;

// STILL BASS

    bass = this.add.image(300, 550, 'bass');
    bass.setScale(0.2)
    bass.visible = false;

// ANIMATED SUNFISH

    this.anims.create({
        key: "neutral",
        frameRate: 1,
        frames: this.anims.generateFrameNumbers("talking_sunfish", {start: 0, end: 0}),
        repeat: 0
    })

    this.anims.create({
        key: "talk",
        frameRate: 2,
        frames: this.anims.generateFrameNumbers("talking_sunfish", {start: 0, end: 1}),
        repeat: -1
    });

    this.anims.create({
        key: "sad",
        frameRate: 2,
        frames: this.anims.generateFrameNumbers("talking_sunfish", {start: 2, end: 6}),
        repeat: 0
    });

    talkingfish = this.add.sprite (300, 383, "talking_sunfish").setScale(0.7);

    talkingfish.visible = false;

//// TEXT DISPLAY

    var text_offset = 12;

// FISH MOOD    

    var mood_x = 190;
    var mood_y = 180;
    var mood_width = 200;
    var mood_height = 30;

    mood_nineslice = this.add.nineslice(
        mood_x, mood_y,
        "textbox", undefined,
        mood_width, mood_height,
        4, 4,
        4, 4
    );

    mood_nineslice.visible = false;

    mood = this.add.text(
        mood_x - mood_width/2 + text_offset, 
        mood_y - mood_height/2 + text_offset, 
        '---', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }, });

    mood.visible = false;

// FISH SPEECH 

    var fish_speech_x = config.width/2;
    var answer1_y = 605;
    var fish_speech_width = 400;
    var fish_speech_height = 60;

    fish_speech_nineslice = this.add.nineslice(
        fish_speech_x, answer1_y,
        "textbox", undefined,
        fish_speech_width, fish_speech_height,
        4, 4,
        4, 4
    );

    fish_speech_nineslice.visible = false;

    fish_speech = this.add.text(
        fish_speech_x - fish_speech_width/2 + text_offset, answer1_y - fish_speech_height/2 + text_offset, 
        '---', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }, });

    fish_speech.visible = false;
    
//// PLAYER ANSWERS

    var answer_width = 300;
    var answer_height = 30;
    var answer_x = config.width/2 +50;

    // ANSWER 1

    var answer1_y = answer1_y + 70;

    answer1_nineslice = this.add.nineslice(
        answer_x, answer1_y,
        "textbox", undefined,
        answer_width, answer_height,
        4, 4,
        4, 4
    );

    answer1_nineslice.visible = false;
    
    answer1 = this.add.text(
        answer_x - answer_width/2 + text_offset, answer1_y - answer_height/2 + text_offset, 
        '---', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }, });

    answer1.visible = false;
            
    function answer1_effect(){
        talkingfish.play("sad");
    }

    answer1_nineslice.setInteractive();
    answer1_nineslice.on('pointerdown', function(pointer){answer1_effect()});

// ANSWER 2

    var answer2_y = answer1_y + 30;

    answer2_nineslice = this.add.nineslice(
        answer_x, answer2_y,
        "textbox", undefined,
        answer_width, answer_height,
        4, 4,
        4, 4
    );

    answer2_nineslice.visible = false;
    
    answer2 = this.add.text(
        answer_x - answer_width/2 + text_offset, answer2_y - answer_height/2 + text_offset, 
        '---', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }, });

    answer2.visible = false;
            
    function answer2_effet(){
        talkingfish.play("talk");
    }

    answer2_nineslice.setInteractive();
    answer2_nineslice.on('pointerdown', function(pointer){answer2_effet()});

// FISH QUESTION 3

    var answer3_y = answer2_y + 30;

    answer3_nineslice = this.add.nineslice(
        answer_x, answer3_y,
        "textbox", undefined,
        answer_width, answer_height,
        4, 4,
        4, 4
    );

    answer3_nineslice.visible = false;
    
    answer3 = this.add.text(
        answer_x - answer_width/2 + text_offset, answer3_y - answer_height/2 + text_offset, 
        '---', 
        { fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000',
            align: 'left',
            wordWrap: { width: 350 }, });
    
    answer3.visible = false;
    
        function answer3_effect() {
        answer3_nineslice.visible = false; 
        answer3.visible = false;
    }

    answer3_nineslice.setInteractive();
    answer3_nineslice.on('pointerdown', function(pointer){answer3_effect()});

}

function update(){

}

//NEXT:

// connect dialog

// depending on scene, configure mood, animations, speech and answers display

// answer choice triggers scene.