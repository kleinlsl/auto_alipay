/**
 * 轮回找能量，直到没有能量
 * @type {string}
 */
var t = 1000;  // 等待时间
var baseSleep = 50;  // 等待时间

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
        b = cycleJudgment("蚂蚁森林",100);

        sleep(1000);
        // 睡眠 1 秒，等待下一次收集
        sleep(t);
        t = t + 10;
    } while (b);
    exit();
}

/**
 * 循环number次，每次50ms，判断condition是否存在
 *
 * @param condition
 * @param number
 * @returns {boolean}
 */
function cycleJudgment(condition, number) {
    let i = 0;
    while (!textEndsWith(condition).exists() && !descEndsWith(condition).exists() && i <= number) {
        sleep(baseSleep);
        i++;
    }
    if (i > number) {
        toastLog(number + "次，未找到：" + condition);
        return false;
    }
    toastLog(i + "次，找到：" + condition);
    return true;
}