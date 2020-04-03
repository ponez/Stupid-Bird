const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const mainImage = new Image()
mainImage.src = "sprite1.png"

const Score = new Audio()
Score.src = "audio/sfx_point.wav"

const Flap = new Audio()
Flap.src = "audio/sfx_flap.wav"

const Hit = new Audio()
Hit.src = "audio/sfx_hit.wav"

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

let chaosMode = false
let normalMode = true

let frames = 0
const degree = Math.PI / 180;


const gameState = {
    nothing: 0,
    ready: 0,
    setGo: 1,
    uSuck: 2
}


const startBtn = {
    x : 140,
    y : 263,
    w : 83,
    h : 29
}
const cancerBtn = {
    x : 220,
    y : 263,
    w : 83,
    h : 29
}
const normalBtn = {
    x : 40,
    y : 263,
    w : 83,
    h : 29
}

//even listener
canvas.addEventListener("click", function (evt) {
    switch (gameState.nothing) {
        case gameState.ready:
            gameState.nothing = gameState.setGo
            SWOOSHING.play()
            break;

        case gameState.setGo:
            if (bird.y - bird.radius <= 0) return
            bird.flap()
            Flap.play()
            break;
        case gameState.uSuck:
            let rect = canvas.getBoundingClientRect()
            let clickX = evt.clientX - rect.left
            let clickY = evt.clientY - rect.top

            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                gameState.nothing = gameState.ready
                console.log('start')
            }
             if(clickX >= cancerBtn.x && clickX <= cancerBtn.x + cancerBtn.w && clickY >= cancerBtn.y && clickY <= cancerBtn.y + cancerBtn.h){
                 chaosMode = true
                                 pipes.reset();
                bird.speedReset();
                score.reset();
                gameState.nothing = gameState.ready
                 console.log('startt')
                 normalMode = false
             }
             if(clickX >= normalBtn.x && clickX <= normalBtn.x + normalBtn.w && clickY >= normalBtn.y && clickY <= normalBtn.y + normalBtn.h){
                                 pipes.reset();
                bird.speedReset();
                score.reset();
                gameState.nothing = gameState.ready
                 chaosMode = false
                 normalMode = true  
                 console.log('n')
             }
            break;
    }
})


const background = {
    sourceX: 0,
    sourceY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,

    draw: function () {
        context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y,
            this.w, this.h)
        //second one is for filling the whole canvas 
        context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x + this.w, this.y,
            this.w, this.h)
    }
}


const fGraound = {
    sourceX: 276,
    sourceY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112,

    dx: 2,

    draw: function () {
        context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y,
            this.w, this.h)
        //second one is for filling the whole canvas 
        context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x + this.w, this.y,
            this.w, this.h)
    },
    update: function () {
        if (gameState.nothing == gameState.setGo) {
            this.x = (this.x - this.dx) % (this.w / 2)
        }
    }
}


const bird = {
    animation: [
        { sourceX: 276, sourceY: 112 },
        { sourceX: 276, sourceY: 139 },
        { sourceX: 276, sourceY: 164 },
        { sourceX: 276, sourceY: 139 }
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    frame: 0,
    rotation: 1,




    draw: function () {
        let bird = this.animation[this.frame]

        context.save()
        context.translate(this.x, this.y)
        context.rotate(this.rotation)
        context.drawImage(mainImage, bird.sourceX, bird.sourceY, this.w, this.h, - this.w / 2, - this.h / 2,
            this.w, this.h)
        context.restore()
    },
    flap: function () {
        this.speed = - this.jump
    },
    update: function () {
        if(normalMode){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = gameState.nothing == gameState.ready ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames % this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame % this.animation.length;

        if (gameState.nothing == gameState.ready) {
            this.y = 150 //bird will get the fuck back to her place (washing dishes)
            this.rotation = 0 * degree
        } else {
            this.speed += this.gravity
            this.y += this.speed
        }
        

            if (this.y + this.h / 2 >= canvas.height - fGraound.h) {
                if(gameState.nothing == gameState.setGo){
                gameState.nothing = gameState.uSuck
                DIE.play()
            }
            }
            if (this.speed >= this.jump) {
                this.rotation = Math.min(Math.PI / 2, this.rotation + (0.1111111));
                this.frame = 1;
            } else {
                this.rotation = -25 * degree;
            }
        
    } else if (chaosMode) {
            // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = gameState.nothing == gameState.ready ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;

        if(gameState.nothing == gameState.ready) {
            this.y = 150 //bird will get the fuck back to her place (washing dishes)

        } else {
            this.speed += this.gravity
            this.y += this.speed
        }
        if(this.y + this.h/2 >= canvas.height - fGraound.h){
                this.speed = - this.speed
                this.y = this.y * 0.99
 
                if (this.y < canvas.height - fGraound.h  ) {
                      this.flap()
                }
        }  
        if(this.speed > this.jump) {
            this.rotation = Math.min(Math.PI/2, this.rotation + 0.3);
            this.frame = 1
        } else if(this.speed === 2) {
          //  this.rotation = 45 * degree
        } else {
            this.rotation = Math.min(Math.PI/2, this.rotation - 0.3);

         //   this.rotation = -25 * degree
        }
        if(bird.x <= 0){
            bird.x += 300
        }

}
    },
    speedReset : function() {
        this.speed = 0;
    }
}



const getReady = {
    sourceX : 0,
    sourceY : 228,
    w : 173,
    h : 152,
    x : canvas.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(gameState.nothing == gameState.ready){
            context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

const gameOverUsuck = {
    sourceX : 176,
    sourceY : 228,
    w : 249,
    h : 202,
    x : canvas.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(gameState.nothing == gameState.uSuck){
            context.drawImage(mainImage, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

const pipes = {
    position: [],

    top: {
        sourceX: 553,
        sourceY: 0
    },
    buttom: {
        sourceX: 502,
        sourceY: 0
    },
    w: 53,
    h: 400,
    gap: 190,
    maxYposition: - 150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i]

            let topYposition = p.y
            let bottomYposition = p.y + this.h + this.gap

            //top pipe

            context.drawImage(mainImage, this.top.sourceX, this.top.sourceY, this.w, this.h,
                p.x, topYposition, this.w, this.h)

            //buttom pipe
            context.drawImage(mainImage, this.buttom.sourceX, this.buttom.sourceY, this.w, this.h,
                p.x, bottomYposition, this.w, this.h)

        }
    },
    update: function () {
        if(normalMode){
        if (gameState.nothing !== gameState.setGo) return

        if (frames % 100 == 0) {
            this.position.push({
                x: canvas.clientWidth,
                y: this.maxYposition * (Math.random() + 1)
            })
        }
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i]

                let bottomYposition = p.y + this.h + this.gap

                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                    gameState.setGo = gameState.uSuck
                    Hit.play()
                }
                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomYposition && bird.y - bird.radius < bottomYposition + this.h) {
                    gameState.setGo = gameState.uSuck
                    Hit.play()
                }
                p.x -= this.dx
                if (p.x + this.w <= 0) {
                    this.position.shift()
    
                }
            if(p.x + this.w <= 0){
              //  this.position.shift();
                score.value += 1;
                Score.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }

    } else if (chaosMode) {
                if(gameState.nothing !== gameState.setGo) return

        if(frames%100 == 0) {
            this.position.push({
                x : canvas.clientWidth,
                y : this.maxYposition * ( Math.random() + 1)
            })
        } 
          
        for(let i = 0; i < this.position.length; i ++){
            let p = this.position[i]

            let topYposition = p.y
            let bottomYposition = p.y + this.h + this.gap

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                Hit.play()
                bird.x = p.x
                bird.x -= 10
                console.log(bird.x,bird.y)  
                if(bird.x <=0 || bird.y <= 0 || bird.x >= 320 || bird.y >= 480){
                    Hit.play()
                    bird.x = 150
                    bird.y = 150
                }              
            }
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomYposition && bird.y - bird.radius < bottomYposition + this.h){
                bird.x = p.x
                bird.y = p.y
                bird.x -= 10
                console.log(bird.x,bird.y)  
                if(bird.x <=0 || bird.y <= 0 || bird.x >= 320 || bird.y >= 480){
                    bird.x = Math.random(320,0 +1) - 0
                    bird.y = Math.random(480, 0 + 1) - 0
                }              

            }
            p.x -= this.dx

            if(p.x + this.w <= 0) {
                this.position.shift()
                
            }
            if(p.x + this.w <= 0){
                // this.position.shift();
                score.value += 1;
                Score.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }

    }
        },
    reset : function(){
        this.position = [];
    }
}

const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        context.fillStyle = "#FFF";
        context.strokeStyle = "#000";
        
        if(gameState.nothing == gameState.setGo){
            context.lineWidth = 2;
            context.font = "35px Teko";
            context.fillText(this.value, canvas.width/2, 50);
            context.strokeText(this.value, canvas.width/2, 50);
            
        }else if(gameState.nothing == gameState.uSuck){
            // SCORE VALUE
            context.font = "25px Teko";
            context.fillText(this.value, 225, 186);
            context.strokeText(this.value, 225, 186);
            // BEST SCORE
            context.fillText(this.best, 225, 228);
        context.strokeText(this.best, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}


function draw() {
    context.fillStyle = "#70c5ce"
    context.fillRect(0, 0, canvas.clientWidth, canvas.height)
    background.draw()
    fGraound.draw()
    bird.draw()
    pipes.draw()
 //   getReady.draw()
    gameOverUsuck.draw()
    score.draw()
}
function update() {
    bird.update()
    fGraound.update()
    pipes.update()
}
function loop() {
    update()
    draw()
    frames++

    requestAnimationFrame(loop)
}

loop()