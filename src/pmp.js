import axios from 'axios';
import QS from "qs";
import FS from "fs";
import {sendMail} from "./utils.js";
import {idArr} from "./id_data.js"

const token = "MTY3Mjc5ODg3OLCrhqGQl7HOhrG_bK-b0qCKnIbasrl4m4XOzrCEnnmkvXWgnoSpvN2Ie690";

function pmpGood(id){
    return axios({
        method: 'post',
        url: 'https://www.pmquanzi.com/api2/document/zan',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            "User-Agent": "Stream/1.0.6 (iPhone; iOS 13.6.1; Scale/2.00)"
        },
        data:QS.stringify({
            id:id,
            token:token,
            source:"app"
        })
    })
}
function pmpRead(id){
    return axios({
        method: 'post',
        url: 'https://www.pmquanzi.com/api2/document/mask_read',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            "User-Agent": "Stream/1.0.6 (iPhone; iOS 13.6.1; Scale/2.00)"
        },
        data:QS.stringify({
            doc_id:id,
            token:token,
            source:"app"
        })
    })
}

var ij=null;
// 打开ij文件
function openIjFile(){
    // 异步读取
    // FS.readFile('ij.txt','utf-8', function(err, data) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     ij=JSON.parse(data.toString());
    //     console.log("文件打开成功！",ij.i,ij.j);     
    // });
    // 同步读取
    let data = FS.readFileSync('ij.txt','utf8');
    ij = JSON.parse(data);
}
// 写入ij文件
function wIjFile(content){
    FS.writeFile('./ij.txt', content, { flag: 'w' }, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
}
function pmpDoc(){
    openIjFile();
    let n = 0, m = 0;
    let t1 = setInterval(() => {
        // 点赞
        console.log("i:"+ij.i);
        if(ij.i>idArr.length){
            clearInterval(t1);
            return false
        };
        pmpGood(idArr[ij.i]).then(res=>{
            if(res.data.status==1){
                n++;
                console.log("已点赞:"+n);
                // 点赞有3个了就不要继续点了
                if(n>=3){
                    console.log("记录i:"+ij.i);
                    wIjFile(JSON.stringify(ij));
                    clearInterval(t1);
                }
            }else{
                if(res.data.msg.includes('登录')){
                    clearInterval(t1);
                }
                console.log(res.data);
            }
        }).finally(()=>{
            ij.i++
        });
    }, 6500);
    // 阅读
    let t2 = setInterval(() => {
        // 点赞
        console.log("j:"+ij.j);
        if(ij.j>idArr.length){
            clearInterval(t2);
            return false
        };
        pmpRead(idArr[ij.j]).then(res=>{
            if(res.data.status==1){
                m++;
                console.log("已阅读:"+m);
                // 阅读有3个了就不要继续了
                if(m>=3){
                    console.log("记录j:"+ij.j);
                    wIjFile(JSON.stringify(ij));
                    clearInterval(t2);
                }
            }else{
                if(res.data.msg.includes('登录')){
                    clearInterval(t2);
                }
                console.log(res.data);
            }
        }).finally(()=>{
            ij.j++;
        });
    }, 10000);
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
            token:token,
            source:"app"
        })
    }).then(res => {
        if(res.data.status==1){
            sendMail("415946604@qq.com","PMP_打卡成功",`恭喜你,打卡成功,积分:${res.data.data.score + res.data.data.score_add}`)
        }else{
            sendMail("415946604@qq.com","PMP_打卡失败","打卡失败，打卡失败，打卡失败")
        }
        console.log(res.data);
    }).catch(error => {
        sendMail("415946604@qq.com","PMP_打卡失败","打卡失败，打卡失败，打卡失败")
        console.error("err:"+error.response)
    })
}
/**
 * 获取文章 START
 */

function getPmpDoc(p){
    axios({
        method: 'post',
        url: 'https://www.pmquanzi.com/api2/document/lists',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            "User-Agent": "Stream/1.0.6 (iPhone; iOS 13.6.1; Scale/2.00)"
        },
        data:QS.stringify({
            id:70,//id:1,2,3,70
            page:p,
            token:token,
            source:"app"
        })
    }).then(res => {
        console.log(res.data.data.length);
        if(res.data.data.length>0){
            for(let i = 0 ;i<res.data.data.length;i++){
                // 当前数组没有才写入
                if(idArr.indexOf(res.data.data[i].id)==-1){
                    console.log(res.data.data[i].id);
                    wFile(res.data.data[i].id+",")
                }
            }
        }
    }).catch(error => {
        console.error("err:"+error.response)
    })
}
// 写入文章id
function wFile(content){
    FS.writeFile('./info.txt', content, { flag: 'a+' }, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
}

/**获取文章 END */

// function timeFn(){
//     let v=1
//     setInterval(() => {
//         getPmpDoc(v)
//         v++;
//     }, 5000);
// }

// pmpDoc();

export {pmpDoc,pmpClock}
