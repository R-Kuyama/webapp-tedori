// #button 要素を取得して定数へ代入
const button = document.getElementById('button');
const resultWrapper = document.getElementById('result-wrapper');

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

// 所得税と住民税 後の計算で使うため戻り値で返してイベント内で定数へ代入する
const irTaxCalc = (n) => {
    if (n >= 60000) { //課税所得が6万以上なら所得税と住民税計算 配列で返す
        return [
            { i: Math.floor(incomeTaxCalc(n - 50000))}, // 所得税計算 所得税用基礎控除の+5万を引いてから計算 Math.floorで小数点切り捨て
            { r: Math.floor(n * 0.1)} // 住民税計算
        ];
    } else if (n >= 10000) { //課税所得が1万以上なら住民税だけ計算
        return [
            { i: 0 }, // 所得税は無し
            { r: Math.floor(n * 0.1)} // 住民税計算
        ];
    } else { //課税所得が1未満ならどちらも無し
        return [
            { i: 0 },
            { r: 0 }
        ];
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

// 個人事業税の計算を定義 
const pbTaxCalc = (n) => {
    if (n >= 2900000) { // 年収290万以上で課税(290万控除) 一律5%
        return (n - 2900000) * 0.05;
    } else {
        return 0;
    }
};


// #button クリックで各種計算実行してグラフ表示
button.addEventListener('click', (e) => {
    
    // ページの更新を無効化
    e.preventDefault();
    
    // 未入力か判定
    if (document.getElementById('number').value == "") {
        alert("1以上の数値を入力して下さい"); // 未入力だとアラート表示
        return false; // 処理を中断する
    }
    
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
    const irTax1 = irTaxCalc(taxableIncome1); // 所得税と住民税計算 戻り値の配列を定数へ代入
    
    // 支出額合計
    const total1 = hoken1 + nenkin1 + irTax1[0].i + irTax1[1].r;
    
    // 手取り額
    const tedori1 = income - total1;
    
    // 支出額合計と手取り額の割合
    const total1Rate = Math.round(total1 / income * 100); // Math.roundで小数があれば四捨五入する
    const tedori1Rate = 100 - total1Rate;
    
    
    /* ここから個人事業主の場合の計算
    国民健康保険 */
    const taxableIncome2 = income - 550000 - 430000; // 算定基礎額を計算して定数へ代入 55万は青色申告控除で43万は基礎控除(住民税用)
    const hoken2 = hoken2Calc(taxableIncome2); // 国民健康保険計算
    
    // 国民年金
    const nenkin2 = 199080; // 2022年の国民年金額16590 * 12か月分
    
    // 所得税と住民税
    const taxableIncome3 = income - hoken2 - nenkin2 - 550000 - 430000; // // 課税所得額(基礎控除は住民税用)を計算して定数へ代入
    const irTax2 = irTaxCalc(taxableIncome3);
    
    // 個人事業税
    const pbTax = pbTaxCalc(income);
    
    // 支出額合計
    const total2 = hoken2 + nenkin2 + pbTax + irTax2[0].i + irTax2[1].r;
    
    // 手取り額
    const tedori2 = income - total2;
    
    // 支出額合計と手取り額の割合
    const total2Rate = Math.round(total2 / income * 100); // Math.roundで小数があれば四捨五入する
    const tedori2Rate = 100 - total2Rate;
    
    
    // 各種金額をHTMLへ入れる .toLocaleString('ja-JP')で金額として表示
    // 年収
    document.getElementById('income').textContent = income.toLocaleString('ja-JP');
    // 会社員
    document.getElementById('tedori1').textContent = tedori1.toLocaleString('ja-JP');
    document.getElementById('tedori1-rate').textContent = tedori1Rate;
    document.getElementById('total1').textContent = total1.toLocaleString('ja-JP');
    document.getElementById('total1-rate').textContent = total1Rate;
    document.getElementById('itax-1').textContent = irTax1[0].i.toLocaleString('ja-JP');
    document.getElementById('rtax-1').textContent = irTax1[1].r.toLocaleString('ja-JP');
    document.getElementById('nenkin1').textContent = nenkin1.toLocaleString('ja-JP');
    document.getElementById('hoken1').textContent = hoken1.toLocaleString('ja-JP');
    // 個人事業主
    document.getElementById('tedori2').textContent = tedori2.toLocaleString('ja-JP');
    document.getElementById('tedori2-rate').textContent = tedori2Rate;
    document.getElementById('total2').textContent = total2.toLocaleString('ja-JP');
    document.getElementById('total2-rate').textContent = total2Rate;
    document.getElementById('pbtax').textContent = pbTax.toLocaleString('ja-JP');
    document.getElementById('itax-2').textContent = irTax2[0].i.toLocaleString('ja-JP');
    document.getElementById('rtax-2').textContent = irTax2[1].r.toLocaleString('ja-JP');
    document.getElementById('nenkin2').textContent = nenkin2.toLocaleString('ja-JP');
    document.getElementById('hoken2').textContent = hoken2.toLocaleString('ja-JP');
    
    
    // Googleチャートの設定
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart1);
    
    function drawChart1() {
    
    // Create the data table.
    var data = google.visualization.arrayToDataTable([
        ['Work', '健康保険料', '年金', '住民税', '所得税', '個人事業税', { role: 'annotation' } ], // 項目名の設定 role...は無いとエラーになる
        ['会社員', hoken1, nenkin1, irTax1[1].r, irTax1[0].i, 0, ''], // 項目ごとの値の設定 最後の空文字も無いとエラーになる
        ['個人事業主', hoken2, nenkin2, irTax2[1].r, irTax2[0].i, pbTax, ''], // ↑
    ]);
    
    // Set chart options
    var options = {
        'title':'支出額をグラフで比較', // グラフのタイトル
        height: 400, // グラフの高さ
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '70%' }, // バーの幅
        isStacked: true, // 積み重ねグラフの設定
    };
    
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    chart.draw(data, options);
    }
    
    
    // result-wrapperを表示
    resultWrapper.style.display = "block"; // .style.displayプロパティでnoneからblockに変更
});

