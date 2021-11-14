/**
 * 轮回找能量，直到没有能量
 * @type {string}
 */
var t = 1000;  // 等待时间

sleep(1000);
// unlock();
sleep(1000);

threads.start(function () {
    //在子线程中调用observeKey()从而使按键事件处理在子线程执行
    events.observeKey();
    events.on("key_down", function (keyCode, events) {
        //音量键关闭脚本
        if (keyCode === keys.volume_down) {
            toast("您选择退出脚本！");
            sleep(2000);
            exit();
        }
    });
});

mainEntrence();

//程序主入口
function mainEntrence() {
    let b;
    do {
        b = true;
        //尝试打开支付宝
        if (b) {
            launchApp("支付宝");
            toastLog("等待支付宝启动");
        }
        clickByTextDesc("找能量", 100);

        sleep(1000);
        // 睡眠 1 秒，等待下一次收集
        sleep(t);
        t = t + 10;
    } while (b);
    exit();
}


function clickByTextDesc(energyType, paddingY) {
    var clicked = false;
    let endsWith = null;
    if (descEndsWith(energyType).exists()) {
        endsWith = descEndsWith(energyType).find();
        toastLog("descEndsWith");
    }
    if (textEndsWith(energyType).exists() && clicked === false) {
        endsWith = textEndsWith(energyType).find();
        toastLog("textEndsWith");
    }
    if (endsWith != null) {
        endsWith.forEach(
            function (pos) {
                toastLog(pos);
                var posb = pos.bounds();
                // toastLog("1. " + posb);
                // toastLog("2. " + posb.centerX());
                // toastLog("3. " + posb.centerY());
                if (posb.centerX() < 0 || posb.centerY() - paddingY < 0) {
                    return false;
                }

                toastLog(pos.id());
                var str = pos.id();
                if (str != null) {
                    // toastLog(str.search("search"));
                    if (str.search("search") === -1) {
                        click(posb.centerX(), posb.centerY() - paddingY);
                        // toastLog("4. " + posb.centerX()+" ,"+ (posb.centerY() - paddingY));
                        clicked = true;
                    }
                } else {
                    click(posb.centerX(), posb.centerY() - paddingY);
                    //toastLog("get it 4");
                    clicked = true;
                }
                sleep(100);
            }
        );
    }
    return clicked;
}