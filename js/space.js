// Cria uma instância de um objeto Phaser.Game e guarda-o na variável local ‘game’
// Os parâmetros passados são a largura e comprimento da área de jogo
var game = new Phaser.Game(300, 500);

var level=1;
var timeLevel = 0;
var speed=100;
var bullets;
var bulletTime=0;
var numBullets=50;
var fireButton;

var mainState = {
// Carrega os dados para o jogo (imagens, áudio, ...)
preload: function() {
  game.load.audio('blaster', 'assets/blaster.mp3');
  game.load.image('hero','assets/hero.png');
  //game.load.image('enemy','assets/enemy.png');
  game.load.image('line','assets/line.png');
  game.load.image('bullet', 'assets/bullets.png');
  game.load.image('asteroid1','assets/asteroid1.png');
  game.load.image('asteroid2','assets/asteroid2.png');
  game.load.image('asteroid3','assets/asteroid3.png');
  game.load.image('asteroid4','assets/asteroid4.png');
  game.load.image('asteroid5','assets/asteroid5.png');
  game.load.image('asteroid6','assets/asteroid6.png');
  game.load.image('asteroid7','assets/asteroid7.png');
  game.load.image('asteroid8','assets/asteroid8.png');
  game.load.image('asteroid9','assets/asteroid9.png');
  game.load.image('asteroid10','assets/asteroid10.png');
  game.load.image('asteroid11','assets/asteroid11.png');
  game.load.bitmapFont('carrier_command','assets/fonts/carrier_command.png','assets/fonts/carrier_command.xml');
},

// Configuração do jogo
create: function() {
  level=1;
  timeLevel=0;
  speed=100;
  numBullets=50;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  this.fireSound = game.add.audio('blaster'); // adiciona o audio
  this.score = -1;
  //this.highScore = 0;
  this.labelScore = game.add.bitmapText(190, 20, 'carrier_command','0',20);


  game.stage.backgroundColor = "#000000";

  /*this.lines =  game.add.group();
  this.addOneLine();*/
  this.timer = game.time.events.loop(1500, this.addEnemy,this); //diminuir velocidade ao timer

  this.timerCharge = game.time.events.loop(10000, this.addCharge,this); //diminuir velocidade ao timer

  this.hero = game.add.sprite(100, 400, 'hero');
  game.physics.arcade.enable(this.hero);
  this.hero.checkWorldBounds = true;

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(1, 'bullet');
    this.bullets.setAll('anchor.x',-1.5);//0.5
    this.bullets.setAll('anchor.y',1);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.recharges = game.add.group();
    this.recharges.enableBody = true;
    this.recharges.physicsBodyType = Phaser.Physics.ARCADE;

    //fireButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);

  var leftKey =
  game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  leftKey.onDown.add(this.heroLeft, this);

  var rightKey =
  game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  rightKey.onDown.add(this.heroRight, this);

  var fireButton =
  game.input.keyboard.addKey(Phaser.Keyboard.UP);
  fireButton.onDown.add(this.fire, this);

  this.enemies = game.add.group();

  var spacekey=
  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spacekey.onDown.add(this.spaceKey, this);

  var escKey=
  game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  escKey.onDown.add(this.pauseGame, this);

},
// Função chamada em loop onde contém a lógica (regras) do jogo
update: function() {
  //game.physics.arcade.overlap(this.car, this.enemies,this.lines, this.restartGame, null, this); //este this.pipes, é grupo de pipes e não o cubo individual, isto porque basta verificar se o passaro bate no tubo

  //this.bird.hitPipe();
  game.physics.arcade.overlap(this.hero, this.enemies, this.hitEnemy, null, this);

  if (this.hero.alive){
    this.score=this.enemies.countDead();//this.score +=1;
    this.labelScore.text = this.score;

  }

  if (this.hero.x == 0)
    this.hero.x = 0;
  if (this.hero.x == 300)
    this.hero.x = 300;
  /*if (this.hero.angle < 20) //40, Não é necessário criar uma função neste caso, pois estamos a mudar o ângulo na funcao update, que está constantemente a ser chamada, isto significa que estamos constantemente a mudar o angulo do passaro para cair, logo não é necessário uma confirmacao ou uma função
    this.bird.angle += 1;*/

    //game.physics.arcade.collide(this.hero, this.floor);
    game.physics.arcade.overlap(this.bullets, this.enemies, this.hitBullet,null, this);

    game.physics.arcade.overlap(this.hero, this.recharges, this.hitCharge,null, this);
},

//NAS FUNCOES DE heroUp e heroDown, tem de se verifihero seo jogo esta pausado
heroLeft: function(){
  if (this.hero.alive == false)
    return;
    if (!game.paused && this.hero.x>75)
      this.hero.x -=75;
},
heroRight: function(){
  if (this.hero.alive == false)
    return;
    if(!game.paused && this.hero.x<225)
      this.hero.x += 75;
},
spaceKey: function(){
  /*if (this.hero.alive == false)
    return;*/
    game.state.add('main', mainState);
    game.state.start('main');
},


addEnemy: function(){
  /*O if abaixo incrementa a dificuldade do jogo gradualmente, sempre que 10 pontos são somados no jogo, aumentando
   a velocidade do jogo ao remover o timer de 1500 e substituindo por um gradualmente menor obtido atarves do calculo: (1500-(this.score)*10)*/
  if(this.score%10==0 && this.score>9){
    game.time.events.remove(this.timer);
    this.timer = game.time.events.loop((1500-(this.score)*10), this.addEnemy,this);
    level++;
    this.labelLevel = game.add.bitmapText(40, 90, 'carrier_command','0',20);
    timeLevel += game.time.elapsed;

    if (timeLevel >= 2){
      timeLevel = 0;
      this.labelLevel.text="LEVEL "+level;
    }
    this.labelLevel.text="";
    speed+=50;
  }
  // Adicionar código para incrementar e apresentar pontuação
  var enemyPos = [20,100,170,260];
  var asteroids = ['asteroid1','asteroid2','asteroid3','asteroid4','asteroid5','asteroid6','asteroid7','asteroid8','asteroid9','asteroid10','asteroid11'];
  var rand = Math.floor((Math.random() * 4));
  var randAsteroids = Math.floor((Math.random() * 11));
  this.enemy = game.add.sprite(enemyPos[rand], 20 ,asteroids[randAsteroids]); //permite adioncar uma imagem ao jogo, através do nome, neste caso 'car'
  game.physics.arcade.enable(this.enemy);
  this.enemy.body.velocity.y=speed;
  this.enemy.checkWorldBounds = true; //passas a testar os limites do jogo
  this.enemy.outOfBoundsKill = true;
  this.enemies.add(this.enemy);
},

addCharge: function(){
  /*O if abaixo incrementa a dificuldade do jogo gradualmente, sempre que 10 pontos são somados no jogo, aumentando
   a velocidade do jogo ao remover o timer de 1500 e substituindo por um gradualmente menor obtido atarves do calculo: (1500-(this.score)*10)*/
  if(this.score%10==0 && this.score>9){
    game.time.events.remove(this.timer);
    this.timer = game.time.events.loop((1500), this.addCharge,this);
  }
  // Adicionar código para incrementar e apresentar pontuação
  var enemyPos = [20,100,170,260];
  var rand = Math.floor((Math.random() * 4));

  this.charge = game.add.sprite(enemyPos[rand], 1,'bullet'); //permite adioncar uma imagem ao jogo, através do nome, neste caso 'car'
  game.physics.arcade.enable(this.charge);
  this.charge.body.velocity.y=speed;
  this.charge.checkWorldBounds = true; //passas a testar os limites do jogo
  this.charge.outOfBoundsKill = true;
  this.recharges.add(this.charge);
},

restartGame: function(){
  game.state.start('main');
},

hitEnemy: function() {
// Se o pássaro já tiver colidido com um tubo não faz nada
if (this.hero.alive == false)
return;
// Altera a propriedade 'alive' do pássaro para false
this.hero.alive = false;

this.labelEndGame = game.add.bitmapText(40, 90, 'carrier_command','0',20);
this.labelEndGame.text="GAME OVER!";
this.labelEndGameSpace = game.add.bitmapText(20, 170, 'carrier_command','0',10);
this.labelEndGameSpace.text="PRESS SPACE TO RESTART";
//falta fazer o restart, start ao estado main, so possivel de reiniciar quando perdido

// Faz com que não apareçam novos tubos
game.time.events.remove(this.timer); //
// Percorre todos os quadrados do tubo para parar o seu movimento
/*this.lines.forEach(function(p){
p.body.velocity.x = 0; //velocidade em x = 0
}, this);*/
},

hitCharge: function(hero,recharges) {
// Se o pássaro já tiver colidido com um tubo não faz nada
if (this.hero.alive == false)
  return;
numBullets+=10;
console.log(numBullets);
recharges.destroy();
game.time.events.remove(this.timer);
},

hitBullet: function(hero, enemies){
  if (bullet && numBullets>0){
  bullet.kill();}
  enemies.kill();
},

pauseGame: function(){
  //mensagem
  //pausar timer
  if (this.hero.alive){
    if (game.paused) {
      game.paused=false;
      this.pauseTitle.destroy();
      this.pauseTitleEsc.destroy();
      game.timer.events.start();
    }else{
      game.paused=true;
      game.time.events.pause();
      this.pauseTitle=game.add.bitmapText(60,90, 'carrier_command','Pause',30);
      //necessario outra label para press esc to restart
      this.pauseTitleEsc=game.add.bitmapText(30,170, 'carrier_command','PRESS ESC TO CONTINUE',10);
    }
  }
},

fire: function() {
  if (this.hero.alive) {
    if (game.time.now > bulletTime) {
      bullet = this.bullets.getFirstExists(false);
    }
    if (bullet && numBullets>0) {
      numBullets--;
      this.labelBullets = game.add.bitmapText(250, 470, 'carrier_command','0',10);
      this.labelBullets.text="1/"+numBullets;
      this.fireSound.play();
      bullet.reset(this.hero.x,this.hero.y);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now+200;
    }
  }
},

};

game.state.add('main', mainState);
game.state.start('main');
