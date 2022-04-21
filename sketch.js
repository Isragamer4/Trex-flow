var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, gameOverImg
var restart, restartImg
var score;
var saut
var indiquer
var deces
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  saut = loadSound("jump.mp3");
  indiquer =  loadSound("checkpoint.mp3");
  deces = loadSound("die.mp3");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
}

function setup() {
  //createCanvas(600, 200);
  createCanvas(windowWidth, windowHeight);
  
  //trex = createSprite(50,180,20,50);
  trex = createSprite(100,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 1;
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(width/2,height-40,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
 // invisibleGround = createSprite(200,190,400,10);
  invisibleGround = createSprite(width/2,height-10,width,40); 
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hola" + 5);
  trex.setCollider("circle",0,0,40)
  score = 0;
  gameOver=createSprite(width/2,height/2- 50);

  gameOver.addImage(gameOverImg);
  restart= createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale=1
  gameOver.scale=1
}

function draw() {
  background(180);
  text("Puntuación: "+ score,  width-250,100);
  
  
  if(gameState === PLAY){
    //mover el suelo
    ground.velocityX = -(6+(score/100));
    if((touches.length > 0 || keyDown("space")) && trex.y >= height-120) {
      saut.play();

      trex.velocityY = -20;
      touches=[];
    }
    
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    score = score + Math.round(getFrameRate()/60);
    if(score%100===0 && score >0){
      indiquer.play();
    }
    //aparecer nubes
    spawnClouds();
    gameOver.visible= false
    restart.visible= false
    //aparecer obstáculos en el suelo
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      deces.play();
      gameState=END
    }

  }
  else if(gameState === END){
    obstaclesGroup.setLifetimeEach(-1); cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);
    //detener el suelo
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    gameOver.visible= true
    restart.visible= true
    if(mousePressedOver(restart) || touches.length > 0){
      touches=[];
      gameState=PLAY
      obstaclesGroup.destroyEach()
      cloudsGroup.destroyEach()
      score=0
      trex.changeAnimation("running",trex_running);
    }
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 120 === 0){
   var obstacle =  createSprite(width+20,height-60,20,30);
   obstacle.velocityX = -(6+(score/100));

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo          
    obstacle.scale = 1;
    obstacle.lifetime = width/2;;
   
   //agregar cada obstáculo al grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 120 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,200));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = width/2;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
  }
  
}
