import nodemailer from "nodemailer";
import axios from 'axios';
import QS from "qs";
// 引入私有信息
import {mailPass} from "./private.js"

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
let chpText = "";
const getCHP = async () =>{
    await axios.get("https://api.shadiao.pro/chp").then(res=>{
        chpText=res.data.data.text;
    })
}

// 打卡
function toClock(token,email){
    axios({
        method: 'post',
        url: 'https://eyme.eyadvisory.cn/timesheet/save',
        data: {"city":"广州市","country":"中国","dateType":"0","myHealth":"一切正常","district":"天河区","province":"广东省"},
        headers: 
            {
                'Content-Type': 'application/json',
                'AC-Token': `WX-AUTH ${token}`,
            }
    }).then(res => {
        sendMail(email,"EY_打卡成功","恭喜你，打卡成功")
        setStatus(email,1)
        console.log(res.data.data.name+"打卡成功")
    }).catch(error => {
        sendMail(email,"EY_打卡失敗！！！","打卡失敗啦！打卡失敗啦！打卡失敗啦！")
        setStatus(email,0)
        console.error(error.response.data)
    })
}

// 检查用户打卡状态
function checkClockStatus(){
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let {items}=res.data;
        if(items.length>0){
            for(let i=0;i<items.length;i++){
                if(!items[i].clockStatus){
                    toClock(items[i].token,items[i].email);
                }
            }
        }
    }).catch(error => {
        console.error("err:"+error.response)
    })
}
// 获取用户，进行打卡
function eyClock_All(){
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let {items}=res.data;
        if(items.length>0){
            for(let i=0;i<items.length;i++){
                toClock(items[i].token,items[i].email);
            }
        }
    }).catch(error => {
        console.error("err:"+error.response)
    })
}

// 获取用户，重置打卡状态
function reSetAll(){
    axios({
        method: 'get',
        url: 'http://81.71.123.165:3000/user/list',
    }).then(res => {
        let {items}=res.data;
        if(items.length>0){
            for(let i=0;i<items.length;i++){
                setStatus(items[i].email,0);
            }
        }
    }).catch(error => {
        console.error("err:"+error.response)
    })
}

// 修改數據庫打卡狀態
function setStatus(mail,status){
    axios({
        method: 'post',
        url: 'http://81.71.123.165:3000/user/changestatus',
        data:{
            email:mail,
            clockStatus:status
        }
    }).then(res => {
        console.log("修改狀態成功",res.data);
    }).catch(error => {
        console.error("err:"+error.response)
    })
}

// 管理圈打卡
function pmpClock(){
    axios({
        method: 'post',
        // url: 'https://www.pmquanzi.com/api2/user/get_qiandao',
        url: 'https://www.pmquanzi.com/api2/user/qiandao_new',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            "User-Agent": "Stream/1.0.6 (iPhone; iOS 13.6.1; Scale/2.00)"
        },
        data:QS.stringify({
            token:"MTY3MDA2MjU5MbF1iWuEqbnTh3uzsa6rs62LhoaSst-Em4W7tLKRi4RssJt5Z4a8vdCTjrd0",
            source:"app"
        })
    }).then(res => {
        console.log(res.data);
    }).catch(error => {
        console.error("err:"+error.response)
    })
}


export {getCHP,eyClock_All,reSetAll,checkClockStatus,pmpClock}