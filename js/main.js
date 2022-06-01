"use strict"
// ヘッダーにゲームタイトル
// スタートボタン、正解時のアニメーション
// 難易度変更
// 制限時間が変わると余白が変わる→事前に要素の範囲をcssで決めておく
// ボタンアニメーション
// 読み込みアニメーション
{
window.addEventListener('load', init); 

function init() {
    gameStart();
    levelChoose();
    
}
// words
const words = [
    '作戦会議の場所シベリアか!?',
    '奥にユリゲラーでもいるんすか?',
    'シンプルバカ!!',
    'どういうお笑い!?',
    'よし鼻殴ろう！',
    'まずくあれ,まずくあれ',
    'ジャンプかマガジン,それでええ',
    'KingGnuの歌い出しぐらい繊細',
    '4Kで脱糞はあかん!',
    '悪夢や',
    '家族のクセがすげえ!',
    'シューマイ2個!',
    '幼稚園の営業か!',
    '死ぬ前の夢か!と思って',
    'わしゃ妖怪ルッコラ食いか',
    'イボ40個の話は新聞に載らない!',
    '死んだ! 大悟が死んだ!',
    'ダイアンだけ渋みがすごい!',
    '服の始まりか!',
    '丸坊主おねぇか!',
    // '大阪であれだけ生やしたキバを、全部品川あたりで抜いてきてるんですよ',
    '脳とかクセやから',
    'GQにフィットせえ!',
    'もう真ん中に置く時代は終わった',
    '人でも殺めてきたんか？',
    'なんやそのイキった名前は!',
    '凄い、ウォーキングデッドぐらいおるな!',
    'CR海物語の岡山バージョンのプレミアムリーチか!'
];

// words's answers
const answers = [
    'sakusenkaiginobashosiberiaka!',
    'okuniyurigera-demoirunsuka?',
    'sinpurubaka!!',
    'douiuowarai!?',
    'yoshihananagurou!',
    'mazukuare,mazukuare',
    'zyanpuka,magazinsoredeee',
    'KingGnunoutaidasiguraisensai',
    '4Kdedappunhaakan!',
    'akumuya',
    'kazokunokusegasugee!',
    'syu-mai2ko!',
    'youtiennoeigyouka!',
    'sinumaenoyumeka!toomotte',
    'wasyayoukairukkoraguika',
    'ibo40konohanasihasinbunninoranai!',
    'sinda!daigogasinda!',
    'daiandakesibumigasugoi!',
    'hukunohazimarika!',
    'marubouzuoneeka!',
    // 'oosakadearedakehayasitakibawo,zenbusinagawaataridenuitekiterundesuyo',
    'noutokakuseyakara',
    'GQnifittosee!',
    'moumannakaniokuzidaihaowatta',
    'hitodemoayametekitanka?',
    'nanyasonoikittanamaeha!',
    'sugoi,who-kingudeddoguraioruna!',
    'CRumimonogatarinookayamaba-zyonnopuremiamuri-tika!'
];

// Available Levels
const levels = {
    easy: 18000,
    medium: 14000,
    hard: 8000
};

// To change level
let currentLevel;

// DOM Elements
const quoteDisplayElement = document.querySelector("#quoteDisplay");
const quoteInputElement = document.querySelector("#quoteInput");
const targetElement = document.querySelector("#target");
const countDownElement = document.querySelector("#log");
const scoreElement = document.querySelector("#score");
const timeLeftElement = document.querySelector("#timeLeft");
const messageElement = document.querySelector("#message");

const easyElement = document.querySelector("#easy");
const mediumElement = document.querySelector("#medium");
const hardElement = document.querySelector("#hard");


// const loadElement = document.querySelector(".cp_loading10");

let startTime;
let isPlaying = false;
let score = 0;
let timeLeftId;

// Audio
const typeSound = new Audio("../audio/typingSound.mp3")
const wrongSound = new Audio("../audio/wrongSound.mp3")
const correctSound = new Audio("../audio/correctSound.mp3")
const countdownSound = new Audio("../audio/countDown.mp3");
const tukkomi = new Audio("../audio/tukkomi.wav");

const elements = [easyElement, mediumElement, hardElement];

class Question {
    constructor() {
        this.num =  Math.floor(Math.random() * words.length);
    }

    setJap() {
        this.word = words.splice(this.num,1)[0];
        targetElement.textContent = this.word;
    }

    setRomaji() {
        this.ans = answers.splice(this.num,1)[0];
        this.ans.split("").forEach(character => {
            const characterSpan = document.createElement("span");
            characterSpan.innerHTML = character;
            quoteDisplayElement.appendChild(characterSpan);
        })
    }
}


function levelChoose() {
    const option = {
        once: true
    };

    easyElement.addEventListener('click', () => {
        currentLevel = levels.easy;
        elements.forEach(element => {
            element.remove();
        });
    }, option)
    mediumElement.addEventListener('click', () => {
        currentLevel = levels.medium;
        elements.forEach(element => {
            element.remove();
        });
    }, option)
    hardElement.addEventListener('click', () => {
        currentLevel = levels.hard;
        elements.forEach(element => {
            element.remove();
        });
    }, option)
}

function gameStart() {
    // 各ボタンのdomに合わせたい
    elements.forEach(element => {
        element.addEventListener('click', () => {
        if (isPlaying === true) {
            return;
        }
        quoteInputElement.focus();
        isPlaying = true;
        countdownSound.play();
        targetElement.innerHTML = null;
        quoteDisplayElement.innerHTML = null;
        const totalTime = 5000;
        const oldTime = Date.now();
        countDownElement.innerHTML = totalTime / 1000;
        const timerId =  setInterval(() => {
            const currentTime = Date.now();
            const diff = currentTime - oldTime;
            const remainMSec = totalTime - diff;
            const remainSec = Math.ceil(remainMSec / 1000);

            if (remainMSec <= 0) {
                clearInterval(timerId);
                countDown();
                countDownElement.remove();
                startTime = Date.now();
                inputKey();
                getQuestion();
            }

            countDownElement.innerHTML = String(remainSec);
        }, 1000);
        });
    })
}

 // 全文字打ち終わった場合
function getQuestion (){
    scoreElement.innerHTML = `スコア: ${score}`;
    // 全問終了
    if (words.length === 0) {
        messageElement.innerHTML = "Game Clear!!"
        gameEnd();
    }
    
    const MyQuestion = new Question();
    MyQuestion.setJap();
    MyQuestion.setRomaji();
    }

function inputKey(){
    quoteInputElement.addEventListener("input", () => {
        typeSound.play();
        typeSound.currentTime = 0;
        const arrayQuote = quoteDisplayElement.querySelectorAll('span');
        const arrayValue = quoteInputElement.value.split("");
        let correct = true;
        arrayQuote.forEach((characterSpan, index) => {
            const character = arrayValue[index];
            if (character == null) {
                characterSpan.classList.remove('correct');
                characterSpan.classList.remove('incorrrect');
                correct = false;
            }
            else if(character === characterSpan.innerText) {
                // console.log(true);
                characterSpan.classList.add('correct');
                characterSpan.classList.remove('incorrect');
            }
            else {
                characterSpan.classList.remove('correct');
                characterSpan.classList.add('incorrect');
                correct = false;
                wrongSound.play();
                wrongSound.volume = 0.3;
            }
        });

        if(correct) {
            countDown();
            correctSound.play();
            correctSound.currentTime = 0;
            score ++;
            messageElement.innerHTML = "Correct!!";
            quoteDisplayElement.innerHTML = null;
            quoteInputElement.value = null;
            getQuestion();
        };
});
}

function countDown() {
    const totalTime = currentLevel;
    const oldTime = Date.now();
    timeLeftElement.innerHTML = `残り時間: ${totalTime / 1000}`;
    clearInterval(timeLeftId);
    timeLeftId = setInterval(() => {
        const currentTime = Date.now();
        const diff = currentTime - oldTime;
        const remainMSec = totalTime - diff;
        const remainSec = Math.ceil(remainMSec / 1000);

        if (remainMSec <= 0) {
            messageElement.innerHTML = "Game Over!!"
            gameEnd();
        }

        timeLeftElement.innerHTML = `残り時間: ${remainSec}`;
    });
}

function gameEnd() {
    const nobu = document.querySelector("#nobu");
    nobu.src = 'images/nobu.jpg';
    clearInterval(timeLeftId);
    tukkomi.play();
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const timeResultElement = document.querySelector("#timeResult");
    timeResultElement.textContent = `Time ${elapsedTime} seconds!`;
    targetElement.remove();
    quoteDisplayElement.remove();
    quoteInputElement.remove();
    
}

}