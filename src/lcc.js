import { sendMail, getSolarDay, getToday, sendSMS, sendBirthdaySMS, sendFestSMS } from "./utils.js";


const lccInfo = {
    name: "车车",
    birthdayY: 1992,
    birthdayM: 6,
    birthdayD: 6,
    mobile: "15602297272",
    text: "有些事情可能你已经忘记，但我依然记得。今天是你的生日，Happy Birthday。"
}

const festivalDate_2023 = [
    { date: "2022-12-25", name: "圣诞", title: "圣诞快乐", text: "圣诞快乐" },
    { date: "2023-1-1", name: "元旦", title: "元旦快乐", text: "元旦快乐" },
    { date: "2023-1-21", name: "除夕", title: "除夕快乐", text: "除夕快乐" },
    { date: "2023-1-22", name: "春节", title: "春节快乐", text: "春节快乐" },
    { date: "2023-6-22", name: "端午", title: "端午安康", text: "端午安康" },
    { date: "2023-9-29", name: "中秋", title: "中秋快乐", text: "中秋快乐" },
    { date: "2023-12-25", name: "圣诞", title: "圣诞快乐", text: "圣诞快乐" },
]

/**
 * 今天是否生日
 */
const isBirthday = (MM, DD) => {
    const BirthdayDate = getSolarDay(MM, DD);
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

// LCC提醒
const lccTips = () => {
    sendMail("xuefu07@gaodun.cn", "报销了吗？", "今天你报销了吗？今天你报销了吗？今天你报销了吗？");
    sendSMS(lccInfo.mobile, lccInfo.name);
}

const lccTips2 = () => {
    // 生日
    if (isBirthday(lccInfo.birthdayM, lccInfo.birthdayD)) {
        sendMail("xuefu07@gaodun.cn", `Phil祝${lccInfo.name}生日快乐`, lccInfo.text);
        sendBirthdaySMS(lccInfo.mobile, lccInfo.name);
    }
    // 节日
    let Festival = isFestival();
    if (Festival && Festival !== null) {
        sendMail("xuefu07@gaodun.cn", Festival.title, lccInfo.name + Festival.text);
        sendFestSMS(lccInfo.mobile, lccInfo.name, Festival.name, Festival.text);
    }
}
// 晚安计划
let nightList = [
    { date: "2022-12-27", smsid: "5214c882c95a4f8c834bf3d586308f2b" },
    { date: "2022-12-28", smsid: "887f065d9ac34fbd90f61eaa2f258e12" },
    { date: "2022-12-29", smsid: "8dbf048e878e4e16be5732683b2c088a" },
    { date: "2022-12-30", smsid: "197463a2e281411f9a70444c05845011" },
    { date: "2022-12-31", smsid: "33539d2961ba4f59b83914ad8ec9ffd1" },
]
const sendNightSMS = (phone, templateId) => {
    axios({
        method: 'post',
        url: 'http://gyytz.market.alicloudapi.com/sms/smsSend',
        headers: {
            'Authorization': 'APPCODE ' + appcode,
        },
        params: {
            "mobile": phone,
            "smsSignId": "174d44f20be544e79edf3981a44e37bc",
            "templateId": templateId
        }
    }).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log("err:", err.response.data);
    })
}
const lccNight = () => {
    let today = getToday();
    nightList.forEach(item => {
        if (item.date == today) {
            sendNightSMS(lccInfo.mobile, item.smsid);
        }
    })
}
export { lccTips, lccTips2, lccNight }