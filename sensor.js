
var os; // OS識別用
var acceleration_offset = 1;
var initialAlpha = 0;// ジャイロセンサーの初期値を0で初期化
var initialBeta = 0;
var initialGamma = 0;
var dataList = {
    "alpha": 0, "beta": 0, "gamma": 0, "direction": 0,
    "X": 0, "Y": 0, "Z": 0,
    "lat": 0, "lng": 0, "acc": 0,
};
// 簡易OS判定
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }
    return ret;
}

window.onload = function init() {
    window.addEventListener("DOMContentLoaded", init); // DOM構築完了イベントハンドラ登録
    // 簡易的なOS判定
    os = detectOSSimply();
    if (os == "iphone") {
        window.addEventListener("deviceorientation",gyro,true);
        window.addEventListener("devicemotion", gSensor);
        window.alert("iPhone");
    } else if (os == "android") {
        window.alert("アンドロイド");
        window.addEventListener("deviceorientation",gyro,true);
        acceleration_offset = -1;
        window.addEventListener("devicemotion", gSensor);
    } else {
        window.alert("PC未対応サンプル");
    }
}

function gSensor(event) { //加速度
    let aX = event.acceleration.x;    
    let aY = event.acceleration.y;    
    let aZ = event.acceleration.z;    

    dataList["X"] = acceleration_offset * aX; // x軸の重力加速度（Android と iOSでは正負が逆）
    dataList["Y"] = acceleration_offset * aY; // y軸の重力加速度（Android と iOSでは正負が逆）
    dataList["Z"] = acceleration_offset * aZ; // z軸の重力加速度（Android と iOSでは正負が逆）
}

function gyro(event) { //角速度
    //let absolute = event.absolute;

    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;
    let degrees;

    if (os == "iphone") {
        // webkitCompasssHeading値を採用
        degrees = event.webkitCompassHeading;
    } else {
        // deviceorientationabsoluteイベントのalphaを補正
        degrees = compassHeading(alpha, beta, gamma);
    }
    // 初期値との差分を計算
    let deltaAlpha = alpha - initialAlpha;
    let deltaBeta = beta - initialBeta;
    let deltaGamma = gamma - initialGamma;

    // 初期値を更新
    initialAlpha = alpha;
    initialBeta = beta;
    initialGamma = gamma;

    let direction;
    if (
        (degrees > 337.5 && degrees < 360) ||
        (degrees > 0 && degrees < 22.5)
    ) {
        direction = "N";
    } else if (degrees > 22.5 && degrees < 67.5) {
        direction = "NE";
    } else if (degrees > 67.5 && degrees < 112.5) {
        direction = "E";
    } else if (degrees > 112.5 && degrees < 157.5) {
        direction = "ES";
    } else if (degrees > 157.5 && degrees < 202.5) {
        direction = "S";
    } else if (degrees > 202.5 && degrees < 247.5) {
        direction = "SW";
    } else if (degrees > 247.5 && degrees < 292.5) {
        direction = "W";
    } else if (degrees > 292.5 && degrees < 337.5) {
        direction = "WN";
    }

    dataList["alpha"] = initialAlpha;
    dataList["beta"] = initialBeta;
    dataList["gamma"] = initialGamma;
    dataList["direction"] = direction;
}

navigator.geolocation.watchPosition((position) => { //GPS位置情報
    let lat = position.coords.latitude;            // 緯度を取得
    let lng = position.coords.longitude;           // 経度を取得
    let acc = position.coords.accuracy;            // 緯度・経度の精度を取得 数値mで表される
    dataList["lat"] = lat;
    dataList["lng"] = lng;
    dataList["acc"] = acc;
});

function sensor() {

    document.querySelector("#lat").innerHTML = dataList["lat"];
    document.querySelector("#lng").innerHTML = dataList["lng"];
    document.querySelector("#acc").innerHTML = dataList["acc"];
    document.querySelector("#direction").innerHTML = dataList["direction"];
    document.querySelector("#alpha").innerHTML = dataList["alpha"];
    document.querySelector("#beta").innerHTML = dataList["beta"];
    document.querySelector("#gamma").innerHTML = dataList["gamma"];

    document.querySelector("#X").innerHTML = dataList["X"];
    document.querySelector("#Y").innerHTML = dataList["Y"];
    document.querySelector("#Z").innerHTML = dataList["Z"];

    //ローカルストレージに記録
    let time_unix = dateFunction()
    localStorage.setItem(time_unix, JSON.stringify(dataList));
    function printValue(id, value) {
        let id_obj = document.getElementById(id);
        id_obj.innerHTML = value;
    }
    function Numlimit5(obj) {
        return Number(obj).toFixed(5);
    }
}

function exportcsv() {
    let finalVal = '';
    // ヘッダー行を追加
    finalVal += "日付,時刻,ロール,ピッチ,ヨー,方角,X,Y,Z,緯度,経度,精度\n";

    var timeStamps = []

    for (let i = 0; i < localStorage.length; i++) {
        let localstragekey = localStorage.key(i)
        timeStamps.push(localstragekey)
    }
    timeStamps.sort()

    for (let i = 0; i < timeStamps.length; i++) {
        let localstragekey = timeStamps[i]
        let d_alpha = "";
        let d_beta = "";
        let d_gamma = "";
        let d_direction = "";
        let d_X = "";
        let d_Y = "";
        let d_Z = "";
        let d_lat = "";
        let d_lng = "";
        let d_acc = "";
        let d;
        if (localStorage.getItem(localstragekey)) {
            d = JSON.parse(localStorage.getItem(localstragekey));
        }
        //キーの値をCSV用にリスト化
        finalVal += localstragekey + "," + d["alpha"] + "," + d["beta"] + "," + d["gamma"] + "," 
        + d["direction"] + "," + d["X"] + "," + d["Y"] + "," + d["Z"] + "," + d["lat"] + "," 
        + d["lng"] + "," + d["acc"] + "\n";
    }

    // Display the month, day, and year. getMonth() returns a 0-based number.
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    //DL用リンクの設定
    let download = document.getElementById('download');
    download.setAttribute('href', 'data:text/csv;charset=UTF-8,' + encodeURIComponent(finalVal));
    download.setAttribute('download', 'sensor' + month + day + '.csv');
}
