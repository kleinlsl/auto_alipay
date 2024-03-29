/**
 * 轮回找能量，指导没有能量
 * @type {string}
 */
var morningTime = "07:28";//自己运动能量生成时间
var startTime = "07:00";
var endTime = "07:30";
var screen_width = 1080;  //设置屏幕的宽度，像素值
var screen_height = 2340; //设置屏幕的高度，像素值
var t=1000;  // 等待时间

sleep(2000);
unlock();
sleep(1000);

threads.start(function(){
    //在子线程中调用observeKey()从而使按键事件处理在子线程执行
    events.observeKey();
    events.on("key_down", function(keyCode, events){
        //音量键关闭脚本
        if(keyCode == keys.volume_down){
            toast("您选择退出脚本！")
            sleep(2000);
            exit();
        }
    });
});

mainEntrence();

//程序主入口
function mainEntrence(){

    let b;
    do {
        b = true;
        //尝试打开支付宝
        if (b) {
            //toastLog("尝试打开支付宝，若失败退出程序");
            b = openAlipay();
        }
        // 尝试进入自己的蚂蚁森林，若失败跳过
        if (b) {
            //toastLog("尝试进入蚂蚁森林，若失败退出程序");
            b = enterMyMainPage();
        }
        if (b) {
            //toastLog("尝试收取自己能量，若失败退出程序");
            //b = collectEnergy("收取自己能量中");
        }
        // 找能量
        while (b && findOthers()) {
            sleep(1000);
            if (myEnergyTime()) {
                if (!textEndsWith("种树").exists()) {
                    back();
                }
                collectEnergy("收取自己能量");
                sleep(100);
            }
        }
        // 执行返回 4 次
        whenComplete(4);
        // 睡眠 1 秒，等待下一次收集
        sleep(t);
        t = t + 1;
    } while (checkTime());
    exit();
}
/*
* 收其他人能量
* return 是否有能量可收
*/
function findOthers(){
    // toastLog("findothers");
    if(textEndsWith("最新动态").exists()){
        //点击关闭障碍物，在自己主页不点击
        if(!textEndsWith("种树").exists())
        {
            click(530,1911);
        }
        sleep(500);
        // 点击按钮寻找能量，不同手机需要更改位置参数
        click(960,1570);
        return collectEnergy("收其他人能量中");
    }
    toastLog("没有能量了");
    return false;
}

/**
 * 解锁函数
 */
function unlock(){
    if(!device.isScreenOn()){
        //点亮屏幕
        device.wakeUp();
        //由于MIUI的解锁有变速检测，因此要点开时间以进入密码界面
        sleep(1000);
        swipe(500, 1900, 500, 0, 2000);
        click(100,150);
        //输入屏幕解锁密码，其他密码请自行修改
        sleep(2000);
        click(250,1440);
        sleep(500);

        click(550,1640);
        sleep(500);

        click(250,1440);
        sleep(500);

        click(840,1640);
        sleep(500);
    }
}


/**
 * 收能量函数
 * return 是否收取成功
 */
function collectEnergy(info) {
    sleep(1700);
    // 判断是否在蚂蚁森林
    if(!textContains("最新动态").exists()){
        return false;
    }
    for(var row=screen_height*0.256;row<screen_height*0.376;row+=80){
        for(var col=screen_width*0.185;col<screen_width*0.815;col+=80){
            sleep(5);
            click(col,row);
        }
    }
    toastLog(info);
    //  sleep(100);
    return true;
}

/**
 * 从支付宝主页进入蚂蚁森林我的主页
 * @returns {boolean} 是否进入成功
 */
function enterMyMainPage(){
    //五次尝试蚂蚁森林入
    var i=0;
    // 拉至顶端
    swipe(screen_width*0.5,screen_height*0.5,screen_width*0.5,screen_height*0.25,500);
    sleep(500);
    swipe(screen_width*0.5,screen_height*0.25,screen_width*0.5,screen_height*0.5,500);

    while (!textEndsWith("蚂蚁森林").exists() && !descEndsWith("蚂蚁森林").exists() && i<=10){
        sleep(500);
        i++;
    }
    if(i>=5){
        toastLog("没有找到蚂蚁森林入口，尝试中");
        clickByTextDesc("全部",0);
        sleep(1000);
        swipe(screen_width*0.5,screen_height*0.3,screen_width*0.5,screen_height*0.7,1000);
        sleep(1000);
        swipe(screen_width*0.5,screen_height*0.3,screen_width*0.5,screen_height*0.7,1000);
        sleep(1000);
    }
    clickByTextDesc("蚂蚁森林",0);

    //等待进入自己的主页,10次尝试
    sleep(3000);
    i=0;
    while (!textEndsWith("种树").exists() && !descEndsWith("种树").exists() && i<=10){
        sleep(1000);
        toastLog("第"+i+"次尝试进入自己主页");
        i++;
    }
    if(i>=10){
        toastLog("进入自己能量主页失败");
        return false;
    }
    return true;
}
/**
 * 自定义的点击函数
 * @param {*} energyType
 * @param {*} paddingY
 */
function clickByTextDesc(energyType,paddingY){
    var clicked = false;
    if(descEndsWith(energyType).exists()){
        descEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            if(posb.centerX()<0 || posb.centerY()-paddingY<0){
                return false;
            }
            //toastLog(pos.id());
            var str = pos.id();
            if(str != null){
                if(str.search("search") == -1){
                    click(posb.centerX(),posb.centerY()-paddingY);
                    //toastLog("get it 1");
                    clicked = true;
                }
            }else{
                click(posb.centerX(),posb.centerY()-paddingY);
                //toastLog("get it 2");
                clicked = true;
            }
            sleep(100);
        });
    }

    if(textEndsWith(energyType).exists() && clicked == false){
        textEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            if(posb.centerX()<0 || posb.centerY()-paddingY<0){
                return false;
            }
            //toastLog(pos.id());
            var str = pos.id();
            if(str != null){
                if(str.search("search") == -1){
                    click(posb.centerX(),posb.centerY()-paddingY);
                    //toastLog("get it 3");
                    clicked = true;
                }
            }else{
                click(posb.centerX(),posb.centerY()-paddingY);
                //toastLog("get it 4");
                clicked = true;
            }
            sleep(100);
        });
    }

    return clicked;
}

/**
 * 结束后返回主页面
 * @param value ： 返回次数
 */
function whenComplete(value) {
    toastLog("结束");
    while(value>0){
        back();
        sleep(1500);
        value--;
    }
}

/**
 * 检测当前时间是否在指定范围内
 * @returns {boolean}
 */
function checkTime(){
    var now =new Date();
    var hour=now.getHours();
    var minu=now.getMinutes();
    var time_a=startTime.split(":");
    var time_b=endTime.split(":");
    var timea = 60*Number(time_a[0])+Number(time_a[1]);
    var timeb = 60*Number(time_b[0])+Number(time_b[1]);
    var time  = 60*hour + minu;
    if(time>=timea && time<=timeb){
        //sleep(2000);
        return true;
    }else{
        return false;
    }
}

/**
 * 是否到了收自己能量的时间
 * @returns {boolean}
 */
function myEnergyTime(){
    var now =new Date();
    var hour=now.getHours();
    var minu=now.getMinutes();
    var mytime=morningTime.split(":");

    if(mytime[0]==hour && (mytime[1]==minu || mytime[1]==minu-1) ){
        return true;
    }else{
        return false;
    }
}

/**
 * 唤醒支付宝
 * @returns {boolean} 是否成功
 */
function openAlipay(){
    launchApp("支付宝");
    toastLog("等待支付宝启动");
    // sleep(3000);
    var i=0;
    while (!textEndsWith("扫一扫").exists() && !descEndsWith("扫一扫").exists() && i<=5){
        sleep(500);
        // 点击首页，防止进入后在其他菜单
        clickByTextDesc("首页",0);
        toastLog("第"+i+"次尝试进入支付宝主页");
        i++;
    }

    if(i>=5){
        toastLog("没有找到支付宝首页");
        //sleep(100);
        return false;
    }
    return true;
}