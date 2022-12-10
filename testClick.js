/**
 * 轮回找能量，直到没有能量
 * @type {string}
 */
auto();
var t = 1000;  // 等待时间
var baseSleep=50;

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
     //尝试打开支付宝
  
     launchApp("支付宝");
     toastLog("等待支付宝启动");
    
    sleep(2000);
    let b;
    do {
        b = true;
       // clickByTextDesc("蚂蚁庄园",0);
       
        toastLog(textContains("蚂蚁庄园").idEndsWith("h5_tv_title").exists());
        toastLog(textContains("领饲料").exists());
        toastLog(textContains("绿色能量").exists());
        sleep(t);
        t = t + 10;
    } while (false);
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
    /*if (textContains(energyType).exists() && clicked === false) {
        endsWith = textContains(energyType).find();
        toastLog("textContains");
    //}*/
    if (endsWith != null) {
        endsWith.forEach(
            function (pos) {
                toastLog(pos);
                var posb = pos.bounds();
                toastLog("1. " + posb);
                toastLog("2. " + posb.centerX());
                toastLog("3. " + posb.centerY());
                if (posb.centerX() < 0 || posb.centerY() - paddingY < 0) {
                    return false;
                }

                toastLog(pos.id());
                var str = pos.id();
                if (str != null) {
                    toastLog(str.search("search"));
                    if (str.search("search") === -1) {
                        click(posb.centerX(), posb.centerY() - paddingY);
                        toastLog("4. " + posb.centerX()+" ,"+ (posb.centerY() - paddingY));
                        clicked = true;
                    }
                } else {
                    click(posb.centerX(), posb.centerY() - paddingY);
                    toastLog("get it 4");
                    clicked = true;
                }
                sleep(100);
            }
        );
    }
    return clicked;
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

 /*
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

  //  }
   // return true;
//}

//}

