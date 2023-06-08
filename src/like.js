import axios from 'axios';
import { sendMail, getSolarDay, getToday, sendSMS } from "./utils.js";


const likeInfoArr = [{
    name: "思思",
    mobile: "15820950631",
    mail: "381961638@qq.com",
    birthdayY: 1999,//1999-11-14(公历)
    birthdayM: 11,
    birthdayD: 14,
    birthdayText: "有些事情可能你已经忘记，但我依然记得。今天是你的生日，Happy Birthday。"
}]

const festivalDate_2023 = [
    { date: "2022-12-25", name: "圣诞", title: "圣诞快乐", text: "圣诞快乐" },
    { date: "2023-1-1", name: "元旦", title: "元旦快乐", text: "元旦快乐" },
    { date: "2023-1-21", name: "除夕", title: "除夕快乐", text: "岁岁无虞 长安常乐" },
    { date: "2023-1-22", name: "春节", title: "春节快乐", text: "新的一年，所求皆如愿 所行皆坦途 多喜乐 长安宁" },
    { date: "2023-6-22", name: "端午", title: "端午安康", text: "端午安康" },
    { date: "2023-9-29", name: "中秋", title: "中秋快乐", text: "中秋快乐" },
    { date: "2023-12-25", name: "圣诞", title: "圣诞快乐", text: "圣诞快乐" },
]

/**
 * 今天是否生日
 */
const isBirthday = (MM, DD) => {
    // const BirthdayDate = getSolarDay(MM, DD);
    const BirthdayDate = `2023-${MM}-${DD}`;
    if (getToday() == BirthdayDate) {
        return true
    } else {
        return false
    }
}
// 是否是节日
const isFestival = () => {
    let res = null;
    let today = getToday();
    festivalDate_2023.forEach(item => {
        if (item.date == today) {
            res = item;
        }
    })
    return res;
}

const birthdayOrFestival = () => {
    likeInfoArr.forEach(likeInfo => {
        // 生日
        if (isBirthday(likeInfo.birthdayM, likeInfo.birthdayD)) {
            sendMail(likeInfo.mail, `Phil祝${likeInfo.name}生日快乐`, likeInfo.birthdayText);
            sendSMS({
                "mobile": likeInfo.mobile,
                "param": `**name**:${likeInfo.name}`,
                "smsSignId": "1862a44b70914103a5cb0f3f70ccaff0",
                "templateId": "1f9bad58ce8241b0834310b0fc994dac"
            })
        } else {
            console.log("no brithday");
        }
        // 节日
        let Festival = isFestival();
        if (Festival && Festival !== null) {
            sendMail(likeInfo.mail, Festival.title, likeInfo.name + Festival.text);
            sendSMS({
                "mobile": likeInfo.mobile,
                "param": `**name**:${likeInfo.name},**date**:${Festival.name},**text**:${Festival.text}`,
                "smsSignId": "87634ba239f04915a51668b38e830148",
                "templateId": "5024d0076caa404a95c869dad41e4b91"
            })
        } else {
            console.log("no festival");
        }
    })
}
// 晚安计划
let nightList = [
    { date: "2023-12-27", smsid: "5214c882c95a4f8c834bf3d586308f2b" },
    { date: "2023-12-28", smsid: "887f065d9ac34fbd90f61eaa2f258e12" },
    { date: "2023-12-29", smsid: "8dbf048e878e4e16be5732683b2c088a" },
    { date: "2023-12-30", smsid: "197463a2e281411f9a70444c05845011" },
    { date: "2023-12-31", smsid: "33539d2961ba4f59b83914ad8ec9ffd1" },
]
const likeNight = () => {
    let today = getToday();
    nightList.forEach(item => {
        if (item.date == today) {
            sendSMS({
                "mobile": likeInfoArr[0].mobile,
                "smsSignId": "174d44f20be544e79edf3981a44e37bc",
                "templateId": item.smsid
            })
        }
    })
}

// pushdeer
const sisiTip1 = () => {
    axios.post(`https://api2.pushdeer.com/message/push`, {
        pushkey: "PDU23124T7V31QIScZqXpR4XNd8s76QYwntRNlp93",
        text: "怎么还不去看书呀，揍扁你"
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

// pushplus
const sisiTip2 = () => {
    axios.get(`http://www.pushplus.plus/send`,
        {
            params: {
                token: "508588edca5e4801a293b7a52be545b9",//sisi
                // token: "4227edc22eb043b9a639b853d9a32fc0",//Phil
                title: "看书了吗？",
                content: "怎么还不去看书呀，揍扁你"
            }
        }).then(res => {
            console.log("success:", res);
        }).catch(err => {
            console.log("fail");
        })
}
export { birthdayOrFestival, likeNight, sisiTip2 }