var level=1;
var speed=100;
var bullets;
var bulletTime=0;
var numBullets=20;
var fireButton;
//Novo nivel
var numBoss=12;
var enemyBullet;

var text;
var textLevel;
var textScore;
var tileSprite;
var tileSprite2;
var explosions;

var move;


BasicGame.Game = function(game) {


};

BasicGame.Game.prototype = {

    create: function(game) {
                //Primeiro nivel
                  numBullets=20;
                  numBoss=12;
                  speed=100;
                  level=1;
                  this.physics.startSystem(Phaser.Physics.ARCADE);
                  this.fireSound = this.add.audio('blaster'); // adiciona o audio balas
                  this.deathSoundAsteroid= this.add.audio('shot2');
                  this.deathSoundBoss= this.add.audio('explosion');
                  this.reloadSound= this.add.audio('reload');
                  this.player_deathSound= this.add.audio('player_death');
                  this.score = -1;
                  //this.highScore = 0;
                  //this.labelScore = this.add.bitmapText(250, 20, 'carrier_command','0',20);


                  //this.stage.backgroundColor =this.game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('bg1').height, 'bg1');//= "#000000";
                  tileSprite = game.add.tileSprite(0, 0, 800, 600, 'bg2');
                  this.timer =this.time.events.loop(1500, this.addEnemy,this); //diminuir velocidade ao timer

                  this.timerCharge = this.time.events.loop(10000, this.addCharge,this); //diminuir velocidade ao timer

                  this.hero = this.add.sprite(90, 400, 'hero');
                  this.hero.scale.setTo(0.5,0.5);
                  this.hero.animations.add('left',[1,2,3,4,5,6,7,8],26,true);
                  this.physics.arcade.enable(this.hero);
                  this.hero.checkWorldBounds = true;

                  this.bullets = this.add.group();
                  this.bullets.enableBody = true;
                  this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
                  this.bullets.createMultiple(1, 'bullet');
                  this.bullets.setAll('anchor.x',-1.5);//0.5
                  this.bullets.setAll('anchor.y',1);
                  this.bullets.setAll('checkWorldBounds', true);
                  this.bullets.setAll('outOfBoundsKill', true);

                  this.recharges = this.add.group();
                  this.recharges.enableBody = true;
                  this.recharges.physicsBodyType = Phaser.Physics.ARCADE;

                  //Novo nivel

                  var leftKey =
                  this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                  leftKey.onDown.add(this.heroLeft, this);

                  var rightKey =
                  this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                  rightKey.onDown.add(this.heroRight, this);

                  var fireButton =
                  this.input.keyboard.addKey(Phaser.Keyboard.UP);
                  fireButton.onDown.add(this.fire, this);

                  this.enemies = this.add.group();

                  var spacekey=
                  this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                  spacekey.onDown.add(this.spaceKey, this);

                  var escKey=
                  this.input.keyboard.addKey(Phaser.Keyboard.ESC);
                  escKey.onDown.add(this.pauseGame, this);

                  //novo nivel

                  this.bosses = this.add.group();
                  this.bossesBullets = this.add.group();

                  this.explosions = game.add.group();
                  this.explosions.createMultiple(30, 'kaboom');
                  this.explosions.forEach(this.setupInvader, this);

                  textScore = game.add.text(230, 30, "Score:0", {
                      font: "30px Arial",
                      fill: "#ffffff",
                      align: "center"
                  });
                  textScore.anchor.setTo(0.5,0.5);

                  text = game.add.text(250, 470, "Bullets:"+numBullets, {
                      font: "10px Arial",
                      fill: "#ffffff",
                      align: "center"
                  });
                  text.anchor.setTo(0.5,0.5);


                  textLevel = game.add.text(game.world.centerX, game.world.centerY, "Level:"+level, {
                        font: "20px Arial",
                        fill: "#ffffff",
                        align: "center"
                  });
                  textLevel.anchor.setTo(0.5,0.5);
    },

    update: function(game) {

                if (this.hero.alive) {
                  this.physics.arcade.overlap(this.hero, this.enemies, this.hitEnemy, null, this);
                  this.physics.arcade.overlap(this.hero, this.bosses, this.endGame, null, this);
                  this.physics.arcade.overlap(this.hero, this.bossesBullets, this.hitEnemy, null, this);
                  this.score=this.enemies.countDead();//this.score +=1;
                  //this.labelScore.text = this.score;
                  textScore.setText("Score:"+this.score);
                }

                  if (this.hero.x == 0)
                    this.hero.x = 0;
                  if (this.hero.x == 300)
                    this.hero.x = 300;

                  if(this.score<100){
                     this.physics.arcade.overlap(this.hero, this.recharges, this.hitCharge,null, this);
                     this.physics.arcade.overlap(this.bullets, this.enemies, this.hitBullet,null, this);
                 }
                 else{
                  //this.labelScore.text="";
                  //tileSprite2 = game.add.tileSprite(0, 0, 800, 600, 'bg1');
                  textScore.setText("");
                  this.physics.arcade.overlap(this.bullets, this.bosses, this.hitBoss,null, this);
                 }


    },


    stopmove: function(){


                    this.hero.body.velocity.x = 0;
                    this.hero.animations.stop();
                    this.hero.facing = 'idle';
    },

    heroLeft: function(){
                if (this.hero.alive == false)
                    return;
                if (!this.paused && this.hero.x>75){

                  if(this.hero.body.velocity.x==0){
                      this.hero.animations.play('left');

                      this.hero.body.velocity.x = -250;

                      move = this.time.events.add(320, this.stopmove,this);

                  }



                  textLevel.setText("");
                  text.setText("Bullets:"+numBullets);

                }
    },

    heroRight: function(){
                if (this.hero.alive == false)
                    return;
                if(!this.paused && this.hero.x<225){


                    if(this.hero.body.velocity.x == 0){
                      this.hero.animations.play('left');

                      this.hero.body.velocity.x = 250;

                      move = this.time.events.add(320, this.stopmove,this);

                  }
                    textLevel.setText("");
                    text.setText("Bullets:"+numBullets);
                }
    },

    spaceKey: function(){
          if (this.hero.alive == true)
            return;
          this.state.add('main', BasicGame.Game.prototype);
          this.state.start('Game');
    },


addEnemy: function(){
    if (this.score<100) {
        if(this.score%10==0 && this.score>9){
          this.time.events.remove(this.timer);
          this.timer = this.time.events.loop((1500-(this.score)*10), this.addEnemy,this);
          level++;
          textLevel.setText("Level:"+level);
          speed+=50;
        }
        // Adicionar código para incrementar e apresentar pontuação
        var enemyPos = [20,100,170,260];
        var asteroids = ['asteroid1','asteroid2','asteroid3','asteroid4','asteroid5','asteroid6','asteroid7','asteroid8','asteroid9','asteroid10','asteroid11'];
        var rand = Math.floor((Math.random() * 4));
        var randAsteroids = Math.floor((Math.random() * 11));
        this.enemy = this.add.sprite(enemyPos[rand], 20 ,asteroids[randAsteroids]); //permite adioncar uma imagem ao jogo, através do nome, neste caso 'car'
        this.physics.arcade.enable(this.enemy);
        this.enemy.body.velocity.y=speed;
        this.enemy.checkWorldBounds = true; //passas a testar os limites do jogo
        this.enemy.outOfBoundsKill = true;
        this.enemies.add(this.enemy);
    }else {
        this.addBoss();
    }
},

addBoss: function(){
        this.time.events.remove(this.timer)
        this.time.events.remove(this.timerCharge);
        //this.timer = this.time.events.loop(1000, this.addBoss,this);
        textLevel.setText("BOSS");
        var boossLayer = [20,100,170,260];
        for (var i = 0; i < boossLayer.length; i++) {
            //first layer
            this.boss = this.add.sprite(boossLayer[i], 20 ,'invader');
            this.physics.arcade.enable(this.boss);
            this.boss.checkWorldBounds = true; //passas a testar os limites do jogo
            this.boss.outOfBoundsKill = true;
            this.bosses.add(this.boss);
            //second layer
            this.boss2 = this.add.sprite(boossLayer[i], 60 ,'invader');
            this.physics.arcade.enable(this.boss2);
            this.boss2.checkWorldBounds = true; //passas a testar os limites do jogo
            this.boss2.outOfBoundsKill = true;
            this.bosses.add(this.boss2);
            //third layer
            this.boss3 = this.add.sprite(boossLayer[i], 100 ,'invader');
            this.physics.arcade.enable(this.boss3);
            this.boss3.checkWorldBounds = true; //passas a testar os limites do jogo
            this.boss3.outOfBoundsKill = true;
            this.bosses.add(this.boss3);
        }
        this.bossFire();
        //this.addCharge();

},
bossFire: function(){
    this.time.events.remove(this.timer);
    this.timerBossBullets = this.time.events.loop((5000), this.bossFire,this);
    var enemyPos = [20,100,170,260];
    var bossBullets = ['bossBullet1','bossBullet2','bossBullet3'];
    var rand = Math.floor((Math.random() * 4));
    var randBossBullet = Math.floor((Math.random() * 3));
    this.bossBullet = this.add.sprite(enemyPos[rand], 20 ,bossBullets[randBossBullet]); //permite adioncar uma imagem ao jogo, através do nome, neste caso 'car'
    this.physics.arcade.enable(this.bossBullet);
    this.bossBullet.body.velocity.y=200;
    this.bossBullet.checkWorldBounds = true; //passas a testar os limites do jogo
    this.bossBullet.outOfBoundsKill = true;
    this.bossesBullets.add(this.bossBullet);
},

addCharge: function(){
  /*O if abaixo incrementa a dificuldade do jogo gradualmente, sempre que 10 pontos são somados no jogo, aumentando
   a velocidade do jogo ao remover o timer de 1500 e substituindo por um gradualmente menor obtido atarves do calculo: (1500-(this.score)*10)*/
  if(this.score%10==0 && this.score>9){
    this.time.events.remove(this.timerCharge);
    this.timerCharge = this.time.events.loop((1500), this.addCharge,this);
  }

  // Adicionar código para incrementar e apresentar pontuação
  var enemyPos = [20,100,170,260];
  var rand = Math.floor((Math.random() * 4));

  this.charge = this.add.sprite(enemyPos[rand], 1,'recharge'); //permite adioncar uma imagem ao jogo, através do nome, neste caso 'car'
  this.physics.arcade.enable(this.charge);
  this.charge.body.velocity.y=speed;
  this.charge.checkWorldBounds = true; //passas a testar os limites do jogo
  this.charge.outOfBoundsKill = true;
  this.recharges.add(this.charge);
},

restartGame: function(){
  this.state.start('main');
},

hitEnemy: function() {
  if (this.hero.alive == false) return;

  this.hero.alive = false;
  var explosion = this.explosions.getFirstExists(false);
  explosion.reset(this.hero.body.x, this.hero.body.y);
  explosion.play('kaboom', 30, false, true);
  this.player_deathSound.play();
  this.labelEndGame = this.add.bitmapText(40, 90, 'carrier_command','0',20);
  this.labelEndGame.text="GAME OVER!";
  this.labelEndGameSpace = this.add.bitmapText(20, 170, 'carrier_command','0',10);
  this.labelEndGameSpace.text="PRESS SPACE TO RESTART";

  //this.timer.remove();
  //this.timerCharge.remove();

},

hitCharge: function(hero,recharges) {

if (this.hero.alive == false)
    return;
numBullets+=10;
recharges.destroy();
text.setText("Bullets:"+numBullets);
this.reloadSound.play();
},


hitBullet: function(hero, enemies){
  if (bullet && numBullets>0)
      bullet.kill();


  var explosion = this.explosions.getFirstExists(false);
  explosion.reset(enemies.body.x, enemies.body.y);
  explosion.play('kaboom', 30, false, true);
  

  this.deathSoundAsteroid.play();
  enemies.kill();


},

setupInvader: function(enemies) {

    enemies.anchor.x = 0.5;
    enemies.anchor.y = 0.5;
    enemies.animations.add('kaboom');

},


hitBoss: function(hero, bosses){
  if (bullet && numBullets>0)
      bullet.kill();

  var explosion = this.explosions.getFirstExists(false);
  explosion.reset(bosses.body.x, bosses.body.y);
  explosion.play('kaboom', 30, false, true);

  bosses.kill();
  this.deathSoundBoss.play();
  numBoss--;
  if (numBoss==0) {
      this.endGame();
  }
},
pauseGame: function(){
 if (this.hero.alive){
    if(this.game.paused == true)
    {
      this.paused = false;
      this.game.paused = false;
      this.pauseTitle.visible = false;
      this.pauseTitleEsc.visible = false;

    }
    else
    {
      this.paused=true;
      this.game.paused = true;
      this.pauseTitle=this.add.bitmapText(60,90, 'carrier_command','Pause',30);
      this.pauseTitleEsc=this.add.bitmapText(30,170, 'carrier_command','PRESS ESC TO CONTINUE',10);
    }
  }
},

fire: function() {
  if (this.hero.alive) {
    if (this.time.now > bulletTime) {
      bullet = this.bullets.getFirstExists(false);
    }
    if (bullet && numBullets>0 && !this.paused) {
      numBullets--;
      text.setText("Bullets:"+numBullets);
      textLevel.setText("");
      this.fireSound.play();
      bullet.reset(this.hero.x,this.hero.y);
      bullet.body.velocity.y = -400;
      bulletTime = this.time.now+200;
    }
  }
},

endGame: function(){
 if (numBoss==0){
     this.time.events.remove(this.timerBossBullets);
     this.time.events.remove(this.timer);
     this.time.events.remove(this.timerCharge);
     this.hero.alive=false;
     this.labelEndGame = this.add.bitmapText(75, 90, 'carrier_command','0',20);
     this.labelEndGame.text="WON!!!";
     this.labelEndGameSpace = this.add.bitmapText(20, 170, 'carrier_command','0',10);
     this.labelEndGameSpace.text="PRESS SPACE TO RESTART";

  }
},

};
