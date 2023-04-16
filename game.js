//  Source for audios
//  https://www.101soundboards.com/boards/10178-flappy-bird-sounds
//  https://www.myinstants.com/en/instant/mario/

//  Source for bird image
//  https://www.iconfinder.com/icons/7765383/video_game_flappy_bird_icon

//Getting elements from HTML
let canvas=document.getElementById('canvas')
let ctx=canvas.getContext('2d')
let score=0

let canvas2=document.getElementById('headCanvas')
let headCtx=canvas2.getContext('2d')

const DIMENSION=800//lower canvas dimension
const GROUND_HEIGHT=147//height of upper and lower rectangles
let bird=new Image()
bird.src = 'bird.png'

let x=250,y=(DIMENSION/2)-50
let w=75,h=75

let numberOfBars=20
const SPACE_BETWEEN_BARS=100
let animateBarsId=null
let barsX=new Array()
let upperBarsLength=new Array()
let lowerBarsLength=new Array()
let speedOfBars=6
let spaceBetweenNewBars=1
let gravity=2

let birdDownId=null
let birdUpId=null

let color=getRandomColor()
let textX=-370, textY=70
let textTimerId=null

let hitAudio=new Audio('hit.mp3')
let flapAudio=new Audio('jump.mp3')
let dieAudio=new Audio('die.mp3')
let backgroundSound=new Audio('backgroundSound.mp3')
backgroundSound.loop=true
hitAudio.loop=false
dieAudio.loop=false
flapAudio.loop=false


moveText()
drawUpperGround()
drawLowerGround()                  
loadBird()
drawInitialBars()

//Setting event listeners
document.addEventListener('keydown',birdUp)
document.addEventListener('keyup',birdDown)

//Responsible for starting the text animtion
function moveText()
{
    if(textTimerId==null)
    {
        textTimerId=setInterval(displayText,30)
    }
}

//Responsible for moving the text when called multiple times
//used to display the text "Save The Bird" on the canvas.
//The function is called in the moveText function of the game.
//The function also plays the background music and calls the birdDown function to move the bird down.
function displayText()
{
    headCtx.clearRect(0,0,1900,100)
    headCtx.beginPath()
    headCtx.font='70px Curlz MT'
    headCtx.fillStyle='red'
    headCtx.strokeStyle='black'
    headCtx.fillText("Save The Bird",textX,textY)
    headCtx.strokeText("Save The Bird",textX,textY)
    headCtx.fill()
    headCtx.stroke()
    headCtx.closePath()

    textX+=15
    if(textX-10>=730)
    {
        clearInterval(textTimerId)
        moveBars()
        birdDown()
        backgroundSound.play()
    }
}

// This function is called when the user hits the spacebar, +, -.
// It causes the bird to flap its wings and go up.
//This function is called when a key is pressed.
//+ key increases the gravity
//- key decreases the gravity
function birdUp(e) 
{
    if(e.key=='+')gravity++
    if(e.key=='-')gravity--
    if(e.key==' ')
    {
        flapAudio.play()
        if (birdDownId != null && birdDownId !=-1) {
            cancelAnimationFrame(birdDownId)
        }
        if(birdDownId!=-1)
            birdDownId = null
        if (birdUpId == null) {
            birdUpId = requestAnimationFrame(rise)
        }
    }
}

// This function is called when the user releases the spacebar.
function birdDown()
{
    if (birdUpId != null && birdDownId !=-1) {
        cancelAnimationFrame(birdUpId)
    }
    if(birdDownId!=-1)
        birdUpId = null
    if (birdDownId == null) {
        birdDownId = requestAnimationFrame(fall)
        console.log("Interval set")
    }
}

//This function is called by the birdDown function to animate the bird falling down.
//checks if the bird has hit the ground or the bars.
//and also clears the canvas and draws the bird at the new position.
function fall()
{
    ctx.clearRect(x,y,w,h)
    y+=gravity
    loadBird()
    if(y>=653-h)
    {   
        gameOver()
    }
    if(barsX.indexOf(x+w)!=-1)
    {
        let a=barsX.indexOf(x+w)
        if(y+h>(GROUND_HEIGHT+507-lowerBarsLength[a]))
        {
            gameOver()
        }
    }
    for(let i=x;i<=x+w+1;i++)
    {
        if(barsX.indexOf(i)!=-1)
        {
            console.log("Fall activated")
            let a=barsX.indexOf(i)
            if(y+h>(GROUND_HEIGHT+507-lowerBarsLength[a]))
            {
                gameOver()
            }
            break
        }
    }
    if(birdDownId!=-1)
        birdDownId=requestAnimationFrame(fall)
}

//This function is called by the birdUp function to animate the bird rising up.
//checks if the bird has hit the ground or the bars.
//and also clears the canvas and draws the bird at the new position.
function rise()
{
    ctx.clearRect(x,y,w,h)
    y-=gravity+2
    loadBird()
    if(y<=GROUND_HEIGHT)
    {
        gameOver()
    }
    if(barsX.indexOf(x+w)!=-1)
    {
        let a=barsX.indexOf(x+w)
        if(y<=upperBarsLength[a]+GROUND_HEIGHT+1)
        {
            gameOver()
        }
    }
    for(let i=x;i<=x+w+1;i++)
    {
        if(barsX.indexOf(i)!=-1)
        {
            let a=barsX.indexOf(i)
            if(y<=upperBarsLength[a]+GROUND_HEIGHT+1)
            {
                gameOver()
            }
            break
        }
    }
    if(birdUpId!=-1)
        birdUpId=requestAnimationFrame(rise)
}

//This function is called when the bird hits the ground or the bars
//and it stops the animation of the bird and the bars, also plays the die and hit sound.
function gameOver() {     

    console.log("Game Over")
    if (birdUpId != null) 
        cancelAnimationFrame(birdUpId)
    if (birdDownId != null)
        cancelAnimationFrame(birdDownId)
    if (animateBarsId != null)
        cancelAnimationFrame(animateBarsId)

    birdUpId=-1
    birdDownId=-1
    headCtx.clearRect(0,0,1800,100)

    headCtx.beginPath()
    headCtx.font='75px Curlz MT'
    headCtx.fillStyle='red'
    headCtx.strokeStyle='black'
    headCtx.fillText("GAME OVER!!!!!",textX-50,textY-5)
    headCtx.strokeText("GAME OVER!!!!!",textX-50,textY-5)
    headCtx.fill()
    headCtx.stroke() 
    headCtx.closePath()

    backgroundSound.pause() 
    dieAudio.play()
    hitAudio.play()
}

//This function loads the bird image and draws it on the canvas.
function drawBird(){bird.onload = loadBird}
function loadBird()
{
    ctx.drawImage(bird, x,y,w,h)
    score++
    document.getElementById('score').innerHTML="Your score : "+score
}

//This function draws a rectangle on the bottom of canvas.
function drawLowerGround()
{
    ctx.beginPath()
    ctx.rect(0,653,800,GROUND_HEIGHT)
    ctx.fillStyle='rgb(165,42,42)'
    ctx.fill()
    ctx.closePath()
}

//This function draws a rectangle on the top of canvas.
function drawUpperGround()
{
    ctx.beginPath()
    ctx.rect(0,0,800,GROUND_HEIGHT)
    ctx.fillStyle='green'
    ctx.fill()
    ctx.closePath()
}

//This function starts the animation of the bars.
function moveBars()
{
    if(animateBarsId==null)
    {
        animateBarsId=requestAnimationFrame(drawBars)
        ctx.save()
    }
}

//This function draws the initial 20 bars on the canvas with random heights.
function drawInitialBars()
{
    for(let index=1;index<=numberOfBars;index++)
    {
        upperBarsLength.push(Math.floor(Math.random()*250))
        lowerBarsLength.push(506-upperBarsLength[index-1]-200)
        ctx.beginPath()
        ctx.rect(DIMENSION+((SPACE_BETWEEN_BARS*2.5)*index),GROUND_HEIGHT,50,upperBarsLength[index])
        ctx.rect(DIMENSION+((SPACE_BETWEEN_BARS*2.5)*index),(GROUND_HEIGHT+506),50,-lowerBarsLength[index])        
        ctx.fillStyle=color
        ctx.fill()
        barsX.push(DIMENSION+((SPACE_BETWEEN_BARS*2.5)*index))
        ctx.closePath()
    }
}

//This function draws the bars on the canvas by clearing the canvas and drawing the bars at the new position multiple times.
//When the bars go out of the canvas, it removes the first bar from the array and adds a new bar at the end of the array.
function drawBars()
{
    for(let index=0;index<numberOfBars;index++)
    {
        ctx.clearRect(barsX[index],GROUND_HEIGHT,50,upperBarsLength[index])
        ctx.clearRect(barsX[index],GROUND_HEIGHT+506,50,-lowerBarsLength[index])
        barsX[index]-=speedOfBars
    }
    for(let index=0;index<numberOfBars;index++)
    {
        ctx.beginPath()
        ctx.rect(barsX[index],GROUND_HEIGHT,50,upperBarsLength[index])
        ctx.rect(barsX[index],GROUND_HEIGHT+506,50,-lowerBarsLength[index])
        ctx.fillStyle=color
        ctx.fill()
        ctx.closePath()
    }
    if(barsX[0]<(-200))
    {
        cancelAnimationFrame(animateBarsId)
        barsX.shift()
        upperBarsLength.shift()
        lowerBarsLength.shift()
        upperBarsLength.push(Math.floor(Math.random()*250))
        lowerBarsLength.push(506-upperBarsLength[upperBarsLength.length-1]-200)
        ctx.rect((barsX[barsX.length-1]+(SPACE_BETWEEN_BARS+50)), GROUND_HEIGHT, 50, upperBarsLength[upperBarsLength.length-1])
        ctx.rect((barsX[barsX.length-1]+(SPACE_BETWEEN_BARS+50)), (GROUND_HEIGHT + 506), 50, -lowerBarsLength[lowerBarsLength.length-1])
        barsX.push(barsX[barsX.length-1]+(SPACE_BETWEEN_BARS)*2.5)

        color=getRandomColor()
        animateBarsId=requestAnimationFrame(drawBars)
    }
    else
        animateBarsId=requestAnimationFrame(drawBars)       
}

//Returns a random color
function getRandomColor()
{
    return 'rgb('+Math.random()*256+','+Math.random()*256+','+Math.random()*256+')'
}
//Opens the youtube music page in a new tab
function youtubeMusic()
{
    window.open("https://www.youtube.com/music", '_blank');
}
//Resets the game
function resetGame()
{
    location.reload()
}