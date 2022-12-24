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
    sendMail("415946604@qq.com", "LCC提醒发送成功", "LCC提醒发送成功");
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
        sendMail("415946604@qq.com", Festival.title, lccInfo.name + Festival.text);
        sendMail("xuefu07@gaodun.cn", Festival.title, lccInfo.name + Festival.text);
        sendFestSMS(lccInfo.mobile, lccInfo.name, Festival.name, Festival.text);
    }
}

export { lccTips, lccTips2 }