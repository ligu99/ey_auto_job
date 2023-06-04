import { sendMail, formatTime, getToday } from "./utils.js";
import axios from 'axios';
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

// 打卡
const toClock = (it) => {
    axios({
        method: 'post',
        url: 'https://eyme.eyadvisory.cn/timesheet/save',
        data: { "city": "广州市", "country": "中国", "dateType": "0", "myHealth": "一切正常", "district": "天河区", "province": "广东省" },
        headers:
        {
            'Content-Type': 'application/json',
            'AC-Token': `WX-AUTH ${it.token}`,
        }
    }).then(res => {
        let exTime = getExTime(it.token);
        let today = getToday();
        sendMail(it.email, "EY_打卡成功", `打卡成功，今天是${today}，token过期时间：${exTime}`)
        setStatus(it.email, 1)
        console.log(res.data.data.name + "打卡成功")
    }).catch(error => {
        sendMail(it.email, "EY_打卡失敗！！！", "打卡失敗啦！打卡失敗啦！打卡失敗啦！")
        setStatus(it.email, 0)
        console.error(error.response.data)
    })
}

// 计算token过期时间
function getExTime(token) {
    let t = jwtDecode(token);
    return formatTime(t.exp * 1000);
}
// 检查用户打卡状态
const checkClockStatus = () => {
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let { items } = res.data;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (!items[i].clockStatus) {
                    toClock(items[i]);
                }
            }
        }
    }).catch(error => {
        console.error("err:" + error.response)
    })
}
// 获取用户，进行打卡
const eyClock_All = () => {
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let { items } = res.data;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                toClock(items[i]);
            }
        }
    }).catch(error => {
        console.error("err:" + error.response)
    })
}

// 获取用户，重置打卡状态
const reSetAll = () => {
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let { items } = res.data;
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                setStatus(items[i].email, 0);
            }
        }
    }).catch(error => {
        console.error("err:" + error.response)
    })
}

// 修改數據庫打卡狀態
const setStatus = (mail, status) => {
    axios({
        method: 'post',
        url: 'http://81.71.123.165:3000/user/changestatus',
        data: {
            email: mail,
            clockStatus: status
        }
    }).then(res => {
        console.log("修改狀態成功", res.data);
    }).catch(error => {
        console.error("err:" + error.response)
    })
}

// EY密码过期提醒
const expiresTip = () => {
    const resetTime = dayjs("2023-01-16");
    const today = dayjs(getToday());
    const diff = today.diff(resetTime, "day");
    if (diff >= 57 && diff < 60) {//值为57的时候，已经过了57天了；值为59的时候，已经过了59天了，最后一次提示当天是最后一天
        sendMail("415946604@qq.com", "EY_密码即将过期！！！", `EY密码将在${60 - diff - 1 > 0 ? 60 - diff - 1 : "今"}天后过期！`)
    }
}

// 提醒指纹打卡
const fingerTip = () => {
    axios.post(`https://api2.pushdeer.com/message/push`, {
        pushkey: "PDU16851TcfISm4GMMbONW7ukAyL9M47SibeNMM89",
        text: "记得指纹打卡"
    }, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        },
    }).then(res => {
        console.log("success");
    }).catch(err => {
        console.log("fail");
    })
}

export { eyClock_All, reSetAll, checkClockStatus, expiresTip, fingerTip }