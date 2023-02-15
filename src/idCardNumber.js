import axios from 'axios';
import FormData from 'form-data';
import QS from "qs";
import CryptoJS from "crypto-js";
var idList=[];

// 腾讯云市场分配的密钥Id
var secretId = "AKID4qVbd2z4l5RL9KYkpC7GMqCng61HE8by65iW";
// 腾讯云市场分配的密钥Key
var secretKey = "hccL25cxN9ezzgxO9gZ83L8koa1SV33eW4kX0rjm";
var source = "market";
// 签名
var datetime = (new Date()).toGMTString();
var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';



const fakeIdCardNumber = () =>{
    let params = new FormData();
    let headers = params.getHeaders();
    params.append('area',"441223");
    params.append('birthday',"1992-07-05");
    params.append('gender',"1");
    axios({
        method: 'post',
        url: 'https://api.tool.dute.me/tool/fakeIdCardNumber',
        // headers:{
        //     'Content-Type': 'multipart/form-data',
        // },
        headers,
        data:params
    }).then(res=>{
        let {number} = res.data.data;
        if(!idList.includes(number)){
            idList.push(number);
            // idcheck(number);
            txCheckId(number)
        }
    })
}

const idcheck = (number) =>{
    axios({
        method: 'post',
        url: '',
        headers: {
            'Authorization': 'APPCODE 3347152217fa4d1b87509be73497bc47',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        data:QS.stringify({
            "idcard":number,
            "name":"林剑敏"
        })
    }).then(res => {
        console.log(JSON.parse(res.data.data));
        let resItem=JSON.parse(res.data.data);
        if(resItem.data.result===1){
            console.log("===============\n",res.data.result,"===============");
            clearInterval(t1)
        }
    }).catch(err => {
        console.log("err:", err);
    })
}

const txCheckId = (id) =>{
    axios({
        method: 'post',
        url: 'https://service-isr6xhvr-1308811306.sh.apigw.tencentcs.com/release/id_name/check',
        headers: {
            "X-Source": source,
            "X-Date": datetime,
            "Authorization": auth,
            'Content-Type': 'application/x-www-form-urlencoded;',
        },
        data:QS.stringify({
            "idcard":id,
            "name":"林敏剑"
        })
    }).then(res => {
        if(res.data.data.result===1){
            console.log(id);
            clearInterval(t1)
        }else{
            console.log(res.data);
            // clearInterval(t1)
        }
    }).catch(err => {
        console.log("err:", err.response.data);
    })
}
fakeIdCardNumber();


let n = 0;
let t1 = setInterval(() => {
    console.log(n++);
    fakeIdCardNumber();
}, 1000*10);