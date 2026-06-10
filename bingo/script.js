// 設定値の定義
const MAX_NUM = 75;
let availableNumbers = []; // まだ出ていない数字を管理する配列
let isSpinning = false; // スピン中かどうかのフラグ
let loopTimer; // setInterval保管用

// DOM要素の取得
const panel = document.getElementById("panel");
const button = document.getElementById("button");
const board = document.getElementById("board");
const soundSlot = document.getElementById("slot");
const soundStop = document.getElementById("stop");

// ==========================================
// 初期化関数
// ==========================================

function init() {
    // 1. まだ出ていない数字(1〜75)の配列を作成する
    for (let i = 1; i <= MAX_NUM; i++) {
        availableNumbers.push(i);
    }

    // 2. 履歴パネルをJavaScriptで動的に生成する
    for (let i = 1; i <= MAX_NUM; i++) {
        const cell = document.createElement("div"); // <div>を作成
        cell.classList.add("cell"); // class="cell" を付与
        cell.id = `cell-${i}`; // id="cell-1" などを付与
        cell.textContent = i; // テキストを挿入
        board.appendChild(cell); // 画面(board)に追加
    }

    // 3. ボタンのクリックイベントを登録
    button.addEventListener("click", handleButtonClick);
}

// ==========================================
// ページ離脱防止
// ==========================================

window.addEventListener("beforeunload", (event) => {
    // まだ抽選履歴が残っている場合のみ警告アラートが出現
    if (availableNumbers.length < MAX_NUM) {
        event.preventDefault();

        // Chrome等で必要
        event.returnValue = "";

        return "";
    }
});

// ==========================================
// 内部関数
// ==========================================

// スピン開始処理
function startSpin() {
    loopTimer = setInterval(() => {
        // スピン中のダミー数字を表示（1〜75のランダム）
        const dummyNum = Math.floor(Math.random() * MAX_NUM) + 1;
        panel.textContent = dummyNum;
    }, 50); // 少し間隔を広げる（画面のチラつきを軽減）
}

// スピン停止処理
function stopSpin() {
    clearInterval(loopTimer);
}

// 抽選処理
function drawNumber() {
    // 残っている数字の配列(availableNumbers)から、ランダムな「位置」を選ぶ
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    // その位置の数字を取り出す（spliceを使うと配列からも削除されるため重複しない）
    const drawnNum = availableNumbers.splice(randomIndex, 1)[0];
    return drawnNum;
}

// ==========================================
// 実行関数
// ==========================================

// ボタンクリック時のメイン処理
function handleButtonClick() {
    // 全部の数字が出終わった場合
    if (availableNumbers.length === 0) {
        alert("すべての番号が出ました。リセット（画面更新）してください。");
        return;
    }

    if (!isSpinning) {
        // --- SPIN開始の処理 ---
        isSpinning = true;
        button.textContent = "STOP";

        // 音楽再生（最初から）
        soundStop.pause();
        soundStop.currentTime = 0;
        soundSlot.play();

        startSpin();
    } else {
        // --- STOP時の処理 ---
        isSpinning = false;
        button.textContent = "SPIN";

        // 抽選して数字を確定し、スピンを止める
        const hitNum = drawNumber();
        stopSpin();
        panel.textContent = hitNum;

        // 履歴パネルの色を変更（直接スタイルを変えるのではなく、classを付与する）
        const cell = document.getElementById(`cell-${hitNum}`);
        cell.classList.add("active");

        // 音楽再生（最初から）
        soundSlot.pause();
        soundSlot.currentTime = 0;
        soundStop.play();
    }
}

// ページ読み込み時に初期化処理(init)を実行
window.onload = init;
