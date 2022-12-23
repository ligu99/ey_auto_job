import nodemailer from "nodemailer";
import axios from 'axios';
import QS from "qs";
import { Lunar } from 'lunar-javascript';
import {mailPass,appcode} from "./private.js"
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
function sendMail(toMail,subject,text){
    info.to=toMail;
    info.subject=subject,
    info.text=text,
    transporter.sendMail(info,function(err,res){
        if(err){
            console.log(err);
        }else{
            // console.log(res);
        }
    })
}

// 獲取彩虹屁
const getCHP = async () =>{
    let chpText = "";
    await axios.get("https://api.shadiao.pro/chp").then(res=>{
        chpText=res.data.data.text;
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
const getToday=()=>{
    const date = new Date();
    const yy = date.getYear(); //获取当前年份(2位)
    const year = date.getFullYear(); //获取完整的年份(4位)
    const month = date.getMonth()+1; //获取当前月份(0-11,0代表1月)
    const day = date.getDate(); //获取当前日(1-31)
    const week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
    const time = date.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    const HH = date.getHours(); //获取当前小时数(0-23)
    const mm = date.getMinutes(); //获取当前分钟数(0-59)
    const ss = date.getSeconds(); //获取当前秒数(0-59)
    return `${year}-${month}-${day}`;
}

// 发送短信提醒
const sendSMS=(phone,name)=>{
    axios({
        method: 'post',
        url: 'http://gyytz.market.alicloudapi.com/sms/smsSend',
        headers:{
            'Authorization':'APPCODE ' + appcode,
        },
        params:{
            "mobile":phone,
            "param":`**name**:${name}`,
            "smsSignId":"1862a44b70914103a5cb0f3f70ccaff0",
            "templateId":"2fab793965244c0eb639d5368861565c"
        }
    }).then(res=>{
        console.log(res.data);
    }).catch(err=>{
        console.log("err:",err.response.data);
    })
}

export {sendMail,getCHP,getSolarDay,getToday,sendSMS};