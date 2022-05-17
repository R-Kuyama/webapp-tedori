// #button 要素を取得して定数へ代入
const button = document.getElementById('button');

const test = document.getElementById('test');

// 給与所得控除額の計算を定義 if文だと見にくいのでswitch文
const deductionCalc1 = (n) => {
    switch (true) {
        case n <= 1625000:
            return 550000;
        case n <= 1800000:
            return n * 0.4 - 100000;
        case n <= 3600000:
            return n * 0.3 + 80000;
        case n <= 6600000:
            return n * 0.2 + 440000;
        case n <= 8500000:
            return n * 0.1 + 1100000;
        default:
            return 1950000;
    }
};

// 所得税の計算を定義
const incomeTaxCalc = (n) => {
    switch (true) {
        case n <= 1950000:
            return (n * 0.05) * 1.02; // *1.02は復興特別所得税分
        case n <= 3300000:
            return (n * 0.1 - 97500) * 1.02;
        case n <= 6950000:
            return (n * 0.2 - 427500) * 1.02;
        case n <= 9000000:
            return (n * 0.23 - 636000) * 1.02;
        case n <= 18000000:
            return (n * 0.33 - 1536000) * 1.02;
        case n <= 40000000:
            return (n * 0.40 - 2796000) * 1.02;
        default:
            return (n * 0.45 - 4796000) * 1.02;
    }
};

// #button クリックで各種計算実行
button.addEventListener('click', (e) => {
    
    // ページの更新を無効化
    e.preventDefault();
    
    // #number の入力値を取得 文字列なので小数点切り捨てはMath.floorではなくparseIntで同時に数値に変換 基数が10進数なので小数点は切り捨てになる
    const number = parseInt(document.getElementById('number').value, 10);
    
    // 1以上か判定
    if (number < 1) {
        alert("1以上の数値を入力して下さい"); // 1未満だとアラート表示
        window.location.reload(); // 1未満でも処理が継続してしまうのでページをリロードしてリセットする
    }
    
    // 万単位で入力されているので *10000 で実際の年収金額にする
    const income = number * 10000;
    
    /* ここから会社員の場合の計算
    健康保険料 */
    const hoken1 = income * 0.05;
    console.log(hoken1);
    
    // 厚生年金
    const nenkin1 = income * 0.0915;
    console.log(nenkin1);
    
    // 所得税
    const deduction1 = deductionCalc1(income); //給与所得控除額を定数へ代入
    const taxableIncome = income - deduction1 - hoken1 - nenkin1 - 480000; // 課税所得額を計算して定数へ代入
    if (taxableIncome >= 1) {
        console.log(Math.floor(incomeTaxCalc(taxableIncome))); //課税所得が1以上なら所得税計算 Math.floorで小数点切り捨て
    } else {
        console.log("所得税はありません"); //課税所得が1未満の場合の表示
    }
});
