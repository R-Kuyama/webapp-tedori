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

// 国民健康保険の計算を定義 後の計算で使うため戻り値で返してイベント内で定数へ代入する
const hoken2Calc = (n) => {
    if (n >= 10000) { // 算定基礎額が1万以上の場合
        return Math.floor((n * 0.103) + 62100); // 所得割額10.3%と均等額・平等額62100円を足して計算
    } else { // 算定基礎額が1万未満の場合
        return 62100; // 所得割額無しで均等額・平等額62100円のみ
    }
};


// #button クリックで各種計算実行
button.addEventListener('click', (e) => {
    
    // ページの更新を無効化
    e.preventDefault();
    
    // #number の入力値を取得 文字列なので小数点切り捨てはMath.floorではなくparseIntで同時に数値に変換 基数が10進数なので小数点は切り捨てになる
    const number = parseInt(document.getElementById('number').value, 10);
    
    // 1未満ではないか判定
    if (number < 1) {
        alert("1以上の数値を入力して下さい"); // 1未満だとアラート表示
        return false; // 処理を中断する
    }
    
    // 年収を定数へ代入 万単位で入力されているので *10000 で実際の金額にする
    const income = number * 10000;
    
    
    /* ここから会社員の場合の計算
    健康保険 */
    const hoken1 = income * 0.05;
    
    // 厚生年金
    const nenkin1 = income * 0.0915;
    
    // 所得税と住民税
    const deduction1 = deductionCalc1(income); //給与所得控除額を計算して定数へ代入
    const taxableIncome1 = income - deduction1 - hoken1 - nenkin1 - 430000; // 課税所得額(基礎控除は住民税用)を計算して定数へ代入
    if (taxableIncome1 >= 60000) { //課税所得が6万以上なら所得税と住民税計算
        const incomeTax1 = Math.floor(incomeTaxCalc(taxableIncome1 - 50000)); // 所得税計算 所得税用基礎控除の+5万を引いてから計算 Math.floorで小数点切り捨て
        const residentTax1 = Math.floor(taxableIncome1 * 0.1); // 住民税計算
    } else if (taxableIncome1 >= 10000) { //課税所得が1万以上なら住民税だけ計算
        console.log("所得税はありません");
        const residentTax1 = Math.floor(taxableIncome1 * 0.1); // 住民税計算
    } else { //課税所得が1未満ならどちらも無し
        console.log("住民税と所得税はありません");
    }
    
    
    /* ここから個人事業主の場合の計算
    国民健康保険 */
    const taxableIncome2 = income - 550000 - 430000; // 算定基礎額を計算して定数へ代入 55万は青色申告控除で43万は基礎控除(住民税用)
    const hoken2 = hoken2Calc(taxableIncome2); // 国民健康保険計算
    
    // 国民年金
    const nenkin2 = 199080; // 2022年の国民年金額16590 * 12か月分
    
    // 所得税と住民税
    const taxableIncome3 = income - hoken2 - nenkin2 - 550000 - 430000; // // 課税所得額(基礎控除は住民税用)を計算して定数へ代入
    if (taxableIncome3 >= 60000) { //課税所得が6万以上なら所得税と住民税計算
        const incomeTax2 = Math.floor(incomeTaxCalc(taxableIncome3 - 50000)); // 所得税計算 所得税用基礎控除の+5万を引いてから計算 Math.floorで小数点切り捨て
        const residentTax2 = Math.floor(taxableIncome3 * 0.1); // 住民税計算
    } else if (taxableIncome3 >= 10000) { //課税所得が1万以上なら住民税だけ計算
        console.log("所得税はありません");
        const residentTax2 = Math.floor(taxableIncome3 * 0.1); // 住民税計算
    } else { //課税所得が1未満ならどちらも無し
        console.log("住民税と所得税はありません");
    }
});
