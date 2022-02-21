const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const gameFin = document.querySelector('.game-over');
const scoreBox = document.querySelector('.game-data');
const restart = document.querySelector('.restart');
let score = 0;
let rank = 1;
let snake = [];
let game;
let time = 300;


//ПЕРЕЗАГРУЖАЕМ СТРАНИЦУ КНОПКОЙ
restart.addEventListener('click', function(event) {
    if(event){
        window.location.reload();
    }
});


//ОБНОВЛЯЕМ ПОЛЕ ИГРЫ
game = setInterval(drawGame, time);

function drawGame() {
    ctx.clearRect(0, 0, 540, 540);
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    let head = {
        x: snakeX,
        y: snakeY
    };
    isOnBoard(head.x, head.y); 
    bitesItself(head, snake);
    if (score == 25) {
        clearInterval(game);
        scoreTable.unshift(score);
        saveScore();
        win();
    }
    drawTarget();
    drawSnake();
    snake.pop();
    snake.unshift(head);
    move();
    eat();
    scoreBox.textContent = `SCORE: ${score} RANK: ${rank}`;
}


//ОТРИСОВЫВАЕМ ЗМЕЮ
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "grey";
        ctx.fillRect(snake[i].x, snake[i].y, square, square);
    }
}


//ДВИГАЕМ ЗМЕЮ
function move() {
    if (dir == 'left') {snake[0].x -= square;}
    if (dir == 'right') {snake[0].x += square;}
    if (dir == 'up') {snake[0].y -= square;}
    if (dir == 'down') {snake[0].y += square;}
}


//ЗМЕЯ ЕСТ
function eat() {
    if (snake[0].x == target.x && snake[0].y == target.y) {
        let audio = new Audio();
        audio.src = './assets/mp3/getItem.mp3'
        audio.play();
        let food = '';
        snake.push(food);
        target = {
            x: Math.floor((Math.random() * 26 + 1)) * square,
            y: Math.floor((Math.random() * 26 + 1)) * square
            }
        score++;
        rank = Math.floor(score/5 + 1);
        riseSpeed(score);
    }
}


//УВЕЛИЧИВАЕМ СКОРОСТЬ
function riseSpeed(scr) {
    if(score > 0 && score % 5 == 0) {
        time -= 50;
        clearInterval(game);
        game = setInterval(drawGame, time);
    }
}
    
//ВЕШАЕМ СЛУШАТЕЛЯ
document.addEventListener('keydown', direction);
let dir;
function direction(event) {
    
    if (event.keyCode == 37 && dir !== 'right')
    dir = 'left';
    else if (event.keyCode == 38 && dir !== 'down') 
    dir = 'up';
    else if (event.keyCode == 39 && dir !== 'left') 
    dir = 'right';
    else if (event.keyCode == 40 && dir !== 'up') 
    dir = 'down';
}


//ОТРИСОВЫВАЕМ ЕДУ
function drawTarget() {
ctx.fillStyle = 'black';
ctx.fillRect(target.x, target.y, square, square);
}

let square = 20;

let target = {
x: Math.floor((Math.random() * 26 + 1)) * square,
y: Math.floor((Math.random() * 26 + 1)) * square
}


//ПРОВЕРЯЕМ, НЕ КУСАЕТ ЛИ ЗМЕЯ СЕБЯ
function bitesItself(firstEl, arr) {
        for(let i = 1; i < arr.length; i++) {
            if(firstEl.x == arr[i].x && firstEl.y == arr[i].y) {
                scoreTable.unshift(score);
                saveScore();
                clearInterval(game);
                loose();
            }  
        }
}


//ПРОВЕРЯЕМ, НЕ УПЕРЛАСЬ ЛИ ЗМЕЯ В СТЕНКУ
function isOnBoard(x, y){
    if(x < 0 || x > 26 * square || y < 0 || y > 26 * square ) {
        scoreTable.unshift(score);
        saveScore();
        clearInterval(game);
        loose();
    }
}


//ПОЗИЦИОНИРЦЕМ ЗМЕЮ НА НАЧАЛО ИГРЫ
snake[0] = {
    x: 13 * square,
    y: 13 * square
};



//ВЫВОДИМ РЕЗУЛЬТАТЫ В ТОР 10
let scoreTable;
function setScoreTable() {
    if(!localStorage.getItem('results')){
        scoreTable = [];
    }
    else {
        scoreTable = [localStorage.getItem('results')];
        let points = document.querySelectorAll('[data-cell]');
        let newScoreTable = scoreTable[0].split(',');
        newScoreTable.sort(function (a, b) {return b -a});
        for(let i = 0; i < points.length; i++) {
            points[i].textContent = newScoreTable[i]
        }
    }
    console.log(scoreTable);
}
setScoreTable();


//ПОБЕДА
function win(){
    let audio = new Audio();
    audio.src = './assets/mp3/win.mp3'
    audio.play();
    gameFin.textContent = 'WIN!';
    gameFin.classList.add('active');
}


//ПОРАЖЕНИЕ
function loose() {
    let audio = new Audio();
    audio.src = './assets/mp3/loose.mp3'
    audio.play();
    gameFin.textContent = 'Game\nover';
    gameFin.classList.add('active');
}


//СОХРАНЯЕМ СЧЕТ
function saveScore(){
    localStorage.setItem('results', scoreTable);
}

