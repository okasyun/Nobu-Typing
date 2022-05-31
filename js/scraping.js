import fetch from 'node-fetch';
import jsdom from 'jsdom';
import fs from 'fs';

const { JSDOM } = jsdom;

// スクレイピング
const box = [];
const URL = "https://www.underwater-festival.com/yj00112/"
const res = await fetch(URL);
const body = await res.text(); // HTMLをテキストで取得
const dom = new JSDOM(body); // パース
const datas = dom.window.document.querySelectorAll(".wp-block-quote>p")// JavaScriptと同じ書き方ができます。
datas.forEach(data =>{
    box.push(data.textContent);
});

// ファイルに書き込み
box.forEach(b => {
    fs.appendFileSync('../text.txt',`${b},\n`, (err, box) => {
        if(err) {
            console.log(err);
        }
    });
});