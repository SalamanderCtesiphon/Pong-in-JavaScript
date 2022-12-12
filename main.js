// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const para = document.querySelector('p');

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (num < 0) {
    return -7;
  } else if (num > 0) {
    return 7;
  }
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.exists = true;
        this.velX = velX;
        this.velY = velY;
    }
}



class Ball extends Shape {

    x = (width / 2)
    y = (height / 2)

    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY);    
        this.color = color;
        this.size = size;
    }


    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
          if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
              this.velX = -(this.velX);
              this.velY = -(this.velY);
            }
          }
        }
      }
      
}

const balls = [];

while (balls.length < 1) {
  const size = 15;
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    "white",
    size
  );

  balls.push(ball);
}



class Paddle {
    constructor(x, y, width, height, velY, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velY = 40;
        this.color = color;
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
              case "k":
                this.y -= this.velY;
                break;
              case "j":
                this.y += this.velY;
                break;
            }
        });
    }

    // draw a rectangluar paddle on the canvas on the right side of the div
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkBounds() {
        if ((this.y + this.height) >= height) {
            this.y = height - this.height;
        }

        if ((this.y) <= 0) {
            this.y = this.height - 160;
        }
    }
    collisionDetect() {
        for (const ball of balls) {
          if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            if (distance < this.size + ball.size) {
              ball.exists = false;
            }
          }
        }
      }
}

const paddle = new Paddle(1700, 300, 15, 160, 0, "white");




let count = 0;

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
  
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }
    count = 0;
    for (const ball of balls) {
        if (ball.exists) {
            count++;
        }
    }
    para.textContent = `Ball count: ${count}`;
    if (count > 0) {
        paddle.draw();
        paddle.checkBounds();
        paddle.collisionDetect();
    }
  
    requestAnimationFrame(loop);
  }
  
  
loop();