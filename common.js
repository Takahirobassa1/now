//計測開始と停止の表示設定
//SafariでDeviceOrientationを許可
function startstop() {
    if (document.getElementById("startStop").innerHTML == "測定開始") {
        sensor_on(); //開始
        document.getElementById("startStop").innerHTML = "停止";
    } else {
        sensor_off(); //停止
        document.getElementById("startStop").innerHTML = "測定開始";
    }
}

var Inter;
var t = 100;
function sensor_on() {
    localStorage.clear(); //スタート時にクリアー
    if (!Inter) {
        Inter = setInterval("sensor()", t);
    }
    //window.addEventListener("devicemotion", sensor, false);
};

function sensor_off() {
    clearInterval(Inter);
    // 変数から intervalID を解放
    Inter = null;
}

// iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
function permitDeviceOrientation() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    detectDirection
                );
            }
        })
        .catch(console.error);
}

//日付オブジェクトの作成
function dateFunction() {
    //日付オブジェクトを作成する
    var date = new Date();
    var year = date.getFullYear();             //dateから「年」を取得する
    var month = date.getMonth() + 1;           //dateから「月」を取得する
    var day = date.getDate();                  //dateから「日」を取得する
    var hour = date.getHours();                //dateから「時」を取得する
    var minutes = date.getMinutes();           //dateから「分」を取得する
    var seconds = date.getSeconds();           //dateから「秒」を取得する
    var milliseconds = date.getMilliseconds(); //dateから「ミリ秒」を取得する
    var dateString = String(month) + String(day) + "," + String(hour) + ":" + String(minutes) + ":" + String(seconds) + "." + String(milliseconds);
    //let dateString = String(minutes) + "_" + String(seconds) + "." + String(milliseconds);    
    return dateString;
    document.querySelector("#date").innerHTML = date;
}
