/**
 * 轮回找能量，直到没有能量
 * @type {string}
 */
const morningTime = "07:24";//自己运动能量生成时间
const startTime = "06:30";
const endTime = "07:50";
const screen_width = 1080;  //设置屏幕的宽度，像素值
const screen_height = 2400; //设置屏幕的高度，像素值
let t = 2000;             // 等待时间
const baseSleep = 50;       // 等待时间
// 障碍物坐标
const barrier = [
    [553, 1921], [556, 1942], [556, 1822]
];
// const energyPoint = [
//     [500, 533],[]
// ];
const findEnergyIndx = [960, 1570];      // 找能量按钮坐标
const maYiName = "蚂蚁森林";            //
const maYiTreeFlag = "动态";             //
const maYiHomeFlag = "去保护";           // 蚂蚁森林 主页标识
const findEndFlag = "返回蚂蚁森林";     // 结束标识

sleep(1000);
unlock();
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
            b = openAlipay();
        }
        // 尝试进入自己的蚂蚁森林，若失败跳过
        if (b) {
            b = enterMyMainPage();
        }
        // 尝试收取自己能量
        if (b) {
            sleep(2000);
            collectEnergy("收取自己能量");
        }
        // 找能量
        while (b && findOthers()) {
            //sleep(500);
            if (myEnergyTime()) {
                if (!textEndsWith(maYiHomeFlag).exists()) {
                    back();
                }
                collectEnergy("收取自己能量");
                sleep(100);
            }
            if (!checkTime()) {
                sleep(1000);
            }
        }
        // 执行返回 4 次
        whenComplete(4);
        // 睡眠 1 秒，等待下一次收集
        sleep(t);
        t = t + 10;
    } while (checkTime());
    exit();
}

/*
* 收其他人能量
* return 是否有能量可收
*/
function findOthers() {
    // sleep(1000);
    //if (cycleJudgment(findEndFlag, 2)) {
    //    toastLog(findEndFlag);
    //    return false;
    //}
    let exist = cycleJudgment(maYiTreeFlag, 20);
    if (exist) {
        //点击关闭障碍物，在自己主页不点击
        if (!textEndsWith(maYiHomeFlag).exists()) {
            for (var i = 0; i < barrier.length; i++) {
                click(barrier[i][0], barrier[i][1]);
            }
        }
        sleep(100);
        // 点击按钮寻找能量，不同手机需要更改位置参数
        click(findEnergyIndx[0], findEnergyIndx[1]);
        return collectEnergy("收其他人能量中");
    }
    toastLog("没有能量了");
    return false;
}

/**
 * 解锁函数
 */
function unlock() {
    if (!device.isScreenOn()) {
        //点亮屏幕
        device.wakeUp();
        //由于MIUI的解锁有变速检测，因此要点开时间以进入密码界面
        sleep(1000);
        swipe(500, 1900, 500, 0, 2000);
        click(100, 150);
        //输入屏幕解锁密码，其他密码请自行修改
        sleep(2000);
        click(250, 1440);
        sleep(500);

        click(550, 1640);
        sleep(500);

        click(250, 1440);
        sleep(500);

        click(840, 1640);
        sleep(500);
    }
}


/**
 * 收能量函数
 * return 是否收取成功
 */
function collectEnergy(info) {
    // 判断是否在蚂蚁森林
    if (!cycleJudgment(maYiTreeFlag, 300)) {
        toastLog("尝试30次，不在蚂蚁森林");
        return false;
    }
    sleep(3000);
    var rowStart = screen_height * 0.23;
    var rowEnd = screen_height * 0.376;
    var row = rowStart;

    var colStart = screen_width * 0.5;
    var colEnd = screen_width;

    var d = 0;
    while (row < rowEnd && (colStart + d) < colEnd) {
        sleep(20);
        click(colStart + d, row);
        click(colStart - d, row);
        d += 85;
        row += 40;
    }
    //toastLog(info);
    log(info);
    return true;
}

/**
 * 从支付宝主页进入蚂蚁森林我的主页
 * @returns {boolean} 是否进入成功
 */
function enterMyMainPage() {
    // 拉至顶端
    sleep(500);
    swipe(screen_width * 0.5, screen_height * 0.25, screen_width * 0.5, screen_height * 0.5, 500);

    let exist = cycleJudgment(maYiName, 100);
    if (!exist) {
        toastLog("没有找到" + maYiName + "入口，尝试中");
        clickByTextDesc("全部", 0);
        sleep(1000);
        swipe(screen_width * 0.5, screen_height * 0.3, screen_width * 0.5, screen_height * 0.7, 1000);
        sleep(1000);
    }
    clickByTextDesc(maYiName, 0);
    //等待进入自己的主页,30次尝试
    return cycleJudgment(maYiHomeFlag, 300);
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
    return true;
}

/**
 * 自定义的点击函数
 *
 * @param {*} energyType
 * @param {*} paddingY
 */
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
                var posb = pos.bounds();
                if (posb.centerX() < 0 || posb.centerY() - paddingY < 0) {
                    return false;
                }

                var str = pos.id();
                if (str != null) {
                    if (str.search("search") === -1) {
                        click(posb.centerX(), posb.centerY() - paddingY);
                        clicked = true;
                    }
                }
                sleep(100);
            }
        );
    }
    return clicked;
}

/**
 * 结束后返回主页面
 * @param value ： 返回次数
 */
function whenComplete(value) {
    toastLog("结束");
    while (value > 0) {
        back();
        sleep(1500);
        value--;
    }
}

/**
 * 检测当前时间是否在指定范围内
 * @returns {boolean}
 */
function checkTime() {
    var now = new Date();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var time_a = startTime.split(":");
    var time_b = endTime.split(":");
    var timea = 60 * Number(time_a[0]) + Number(time_a[1]);
    var timeb = 60 * Number(time_b[0]) + Number(time_b[1]);
    var time = 60 * hour + minu;
    if (time >= timea && time <= timeb) {
        //sleep(2000);
        return true;
    } else {
        return false;
    }
}

/**
 * 是否到了收自己能量的时间
 * @returns {boolean}
 */
function myEnergyTime() {
    var now = new Date();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var mytime = morningTime.split(":");

    if (mytime[0] === hour && (mytime[1] === minu || mytime[1] === minu - 1)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 唤醒支付宝
 * @returns {boolean} 是否成功
 */
function openAlipay() {
    sleep(1000);
    launchApp("支付宝");
    toastLog("等待支付宝启动");
    var i = 0;
    while (!textEndsWith("扫一扫").exists() && !descEndsWith("扫一扫").exists() && i <= 5) {
        sleep(500);
        // 点击首页，防止进入后在其他菜单
        launchApp("支付宝");
        clickByTextDesc("首页", 0);
        i++;
    }
    toastLog("第" + i + "次尝试进入支付宝主页");
    if (i >= 5) {
        toastLog("没有找到支付宝首页");
        return false;
    }
    return true;
}
