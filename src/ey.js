import {sendMail} from "./utils.js";
import axios from 'axios';

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

export {eyClock_All,reSetAll,checkClockStatus}