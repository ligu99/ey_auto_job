import nodemailer from "nodemailer";
import axios from 'axios';
import QS from "qs";
import { Lunar } from 'lunar-javascript';
import { mailPass, appcode } from "./private.js"
// 创建Nodemailer传输器 SMTP 或者 其他 运输机制
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 第三方邮箱的主机地址
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "laipili@qq.com", // 发送方邮箱的账号
        pass: mailPass, // 邮箱授权密码
    },
});
let info = {
    from: '"Phil.Lai" <laipili@qq.com>', // 发送方邮箱的账号
    to: "", // 邮箱接受者的账号
    subject: "", // Subject line
    text: "", // 文本内容
    //   html: "", // html 内容, 如果设置了html内容, 将忽略text内容
};
// 發送郵件
function sendMail(toMail, subject, text) {
    info.to = toMail;
    info.subject = subject,
        info.text = text,
        transporter.sendMail(info, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                // console.log(res);
            }
        })
}

// 獲取彩虹屁
const getCHP = async () => {
    let chpText = "";
    await axios.get("https://api.shadiao.pro/chp").then(res => {
        chpText = res.data.data.text;
    })
    return chpText;
}

/**
 * 传入农历生日月日，返回对应的今年的公历年月日
 * @param {number} month
 * @param {number} day 
 */
const getSolarDay = (month, day) => {
    const thisYear = new Date().getFullYear();//当前时间的年
    let lunarInThisYear = Lunar.fromYmd(thisYear, month, day);//获取今年阴历生日对象
    let solarInThisYear = lunarInThisYear.getSolar();//获取今年阴历生日对应的阳历对象
    // const lunar = Lunar.fromYmd(Number(year), month, day)//获取生日那年对应的阳历对象
    // const solar = lunar.getSolar()//获取生日那年对应的阳历对象
    if (solarInThisYear.getYear() > thisYear) { //判断阴历年底，公历是否递增了1年
        lunarInThisYear = Lunar.fromYmd(thisYear - 1, month, day);
        solarInThisYear = lunarInThisYear.getSolar();
    }
    return `${thisYear}-${solarInThisYear.getMonth()}-${solarInThisYear.getDay()}`;
}

/**
 * 获取今天的日期
 */
const getToday = () => {
    const date = new Date();
    const yy = date.getYear(); //获取当前年份(2位)
    const year = date.getFullYear(); //获取完整的年份(4位)
    const month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    const day = date.getDate(); //获取当前日(1-31)
    const week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
    const time = date.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    const HH = date.getHours(); //获取当前小时数(0-23)
    const mm = date.getMinutes(); //获取当前分钟数(0-59)
    const ss = date.getSeconds(); //获取当前秒数(0-59)
    return `${year}-${month}-${day}`;
}

// 时间格式化
const formatTime = time => {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

// 短信签名ID
const smsSign = [{
    name: "Phli提醒",
    smsSignIdid: "1862a44b70914103a5cb0f3f70ccaff0",
}, {
    name: "晚安计划",
    smsSignIdid: "174d44f20be544e79edf3981a44e37bc",
}, {
    name: "车车专属",
    smsSignIdid: "87634ba239f04915a51668b38e830148",
}];
// 短信签名ID
const templateIdList = [{
    name: "邮件提醒",
    templateId: "2fab793965244c0eb639d5368861565c",
}, {
    name: "生日祝福",
    templateId: "1f9bad58ce8241b0834310b0fc994dac",
}, {
    name: "节日祝福",
    templateId: "5024d0076caa404a95c869dad41e4b91",
}];

/* 发送短信
params {
    "mobile"，
    "param",`**name**:${name},**name2**:${name2}`//短信内容参数，多个参数用逗号分割
    "smsSignId",//签名ID
    "templateId"//模板ID
}
*/
const sendSMS = (params) => {
    axios({
        method: 'post',
        url: 'http://gyytz.market.alicloudapi.com/sms/smsSend',
        headers: {
            'Authorization': 'APPCODE ' + appcode,
        },
        params: params
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log("err:", err.response.data);
    })
}

// 生成指定范围内的随机整数
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomColor = () => {
    // 生成3个随机数，分别代表红、绿、蓝色的值
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    // 使用16进制表示法将RGB颜色转换成字符串形式
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);

    // 返回随机生成的颜色
    return color;
}

export { sendMail, getCHP, getSolarDay, getToday, sendSMS, formatTime };