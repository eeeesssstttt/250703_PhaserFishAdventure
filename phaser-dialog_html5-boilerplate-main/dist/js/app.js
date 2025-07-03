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
    this.load.image('lake', 'assets/lake_hopatcong.jpg')
    this.load.image('sunfish', 'assets/sunfish.jpg');
    this.load.image('bass', 'assets/largemouth_bass5.jpg')
    this.load.spritesheet('talking_sunfish', 'assets/talking_sunfish_smaller.png', {frameWidth: 640, frameHeight: 480})
}

function create(){
    lake = this.add.image(300, 400, 'lake');
    lake.setScale(1.2)

    // sunfish = this.add.image(300, 400, 'sunfish');
    // sunfish.setScale(0.1);

    // bass = this.add.image(300, 500, 'bass');
    // bass.setScale(0.2)

    this.anims.create({
        key: "talk",
        frameRate: 2,
        frames: this.anims.generateFrameNumbers("talking_sunfish", {start: 0, end: 1}),
        repeat: -1
    })
    talkingfish = this.add.sprite (300, 383, "talking_sunfish").setScale(0.7
    );
    talkingfish.play("talk");
}

function update(){

}