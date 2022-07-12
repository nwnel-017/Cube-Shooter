
var gameScreen = document.getElementById("window");
var c = gameScreen.getContext("2d");


gameScreen.width = window.innerWidth;
gameScreen.height = window.innerHeight;

let titleText = document.getElementById('title-text');
let buttonText = document.getElementById('gamebutton');

var w = gameScreen.width;
var h = gameScreen.height;

var heroX = 0;
var heroY = 0;
var heroWidth = 50;
var heroHeight = 50;

var numOfEnemies = 5;
let enemies = [];
let projectiles = [];
let hero;

var timer;
var playerScore = 0;

var enemyX = 1400;
var enemyWidth = 50;
var enemyHeight = 50;

var playerScore = 0;
let spawnInterval;
let intervalTime = 500;
let spawnRateInterval;
let projectileInterval;

let users = [];

function startGame() 
{
	playerScore = 0;
	intervalTime = 1000;
	enemies.splice(0, enemies.length);
	console.log(enemies);
	projectiles.splice(0, projectiles.length);
	clearInterval(spawnInterval);
	clearInterval(spawnRateInterval);
	titleText.innerHTML="Score: " + playerScore;
	//move the hero with mouse movement
	window.addEventListener('mousemove', moveWithMouse);
	window.addEventListener('click', shootProjectile); 
	hero = new Hero(0, 0);
	spawnInterval = setInterval(spawnEnemies, intervalTime);
	spawnRateInterval = setInterval(increaseSpawnRate, 5000);
	//projectileInterval = setInterval(shootProjectile(event), 500);

	animate();
}

function shootProjectile(event){
	var projectile = new Projectile(event.clientX - gameScreen.offsetLeft, event.clientY - gameScreen.offsetTop, 10, 'red', 20);
	projectiles.push(projectile);
}

function increaseSpawnRate(){
	clearInterval(spawnInterval);
	if(intervalTime > 200){
		intervalTime = intervalTime/1.3
	}
	console.log(intervalTime);
	spawnInterval = setInterval(spawnEnemies, intervalTime);
}

function incrementScore(){
	playerScore++;
	titleText.innerHTML = "Score: " + playerScore;
}

function spawnEnemies(){
		var enemyY = Math.random() * h;
		var velocity = Math.floor(Math.random()*10) + 5;
		var badGuy = new Enemy(enemyX, enemyY, velocity);
		enemies.push(badGuy);
}






var animationId;
var cancelRequest;

function animate(){
	animationId = requestAnimationFrame(animate);
	c.clearRect(0, 0, w, h);
	hero.draw();

	projectiles.forEach((projectile, projectileIndex, projectiles) => {
		projectile.move();
		projectile.draw();
	})

	enemies.forEach((enemy, enemyIndex, enemies) => {
		if(hero.x < enemy.x + 50 && 
		   hero.x + 50 > enemy.x &&
		   hero.y < enemy.y + 50 &&
		   hero.y + 50 > enemy.y) {
		    //enemy and hero collide
		    cancelAnimationFrame(animationId);
			window.removeEventListener('mousemove', moveWithMouse);
			gameOver();
		} 
		if(enemy.x >= 0){ //enemy moves forward
			enemy.move();
			enemy.draw();
		}
		else{ //enemy is off the screen
			enemies.splice(enemyIndex, 1);
			playerScore++;
			titleText.innerHTML = "Score: " + playerScore;
		}
		projectiles.forEach((projectile, projectileIndex, projectiles) => { //this is going really wrong somewhere
			var distanceX = Math.abs(projectile.x - enemy.x - enemyWidth/2);
			var distanceY = Math.abs(projectile.y - enemy.y - enemyHeight/2);
			if(distanceX <= (enemyWidth/2) + 10 && distanceY <= (enemyHeight/2) + 10){
				//they are colliding
				projectiles.splice(projectileIndex, 1);
				enemies.splice(enemyIndex, 1);
				playerScore++;
			}
		})
	})
}
	
	function moveWithMouse(event)
	{
		x = event.clientX;
		y = event.clientY;
		x-= gameScreen.offsetLeft + (heroWidth/2);
		y-= gameScreen.offsetTop + (heroHeight/2);
		hero.move(x, y);
	}

	function gameOver(){
		buttonText.style.display='inline';
		titleText.innerHTML = 'Game Over. Your Score: ' + playerScore;
		buttonText.innerHTML = 'Restart?';
	}


	class Enemy {
		constructor(enemyX, enemyY, velocity){
			this.x = enemyX;
			this.y = enemyY;
			this.velocity = velocity;
		}
		draw(){
			c.fillStyle = 'rgba(255, 0, 0, 0.5)';
			c.fillRect(this.x, this.y, enemyWidth, enemyHeight);
		}
		move(){ //for whatever reason doesn't clear the full enemy height
			c.fillStyle = 'rgba(255, 0, 0, 0.5)';
			this.x -= this.velocity;
		}
	}


	class Hero {
		constructor(x, y){
			this.x = x;
			this.y = y;
		}
		draw(){
			c.fillStyle = 'rgba(0, 0, 255, 0.5)';
			c.fillRect(this.x, this.y, enemyWidth, enemyHeight);
		}
		move(newX, newY){ 
			this.x = newX;
			this.y = newY;
		}
	}
	class Projectile {
		constructor(x, y, radius, color, velocity){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.color = color;
			this.velocity = velocity;
		}
		draw(){
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			//c.fillStyle = this.color;
			c.fillStyle = 'rgba(0, 0, 255, 0.5)';
			c.fill();
		}
		move(){
			this.x += this.velocity;
		}
	}
	class User {
		constructor(username, score){
			this.username = username;
			this.lastScore = score;
			if(this.highScore < score){
				this.highScore = score;
			}
		}
	}

