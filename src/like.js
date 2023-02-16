import { sendMail, getSolarDay, getToday, sendSMS } from "./utils.js";


const likeInfo = {
    name: "车车",
    mobile: "15602297272",
    mail:"xuefu07@gaodun.cn",
    birthdayY: 1992,
    birthdayM: 6,
    birthdayD: 6,
    birthdayText: "有些事情可能你已经忘记，但我依然记得。今天是你的生日，Happy Birthday。"
}

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
const likeTips = () => {
    sendMail(likeInfo.mail, "报销了吗？", "今天你报销了吗？今天你报销了吗？今天你报销了吗？");
}

const birthdayOrFestival = () => {
    // 生日
    if (isBirthday(likeInfo.birthdayM, likeInfo.birthdayD)) {
        sendMail(likeInfo.mail, `Phil祝${likeInfo.name}生日快乐`, likeInfo.birthdayText);
        sendSMS({
            "mobile": likeInfo.mobile,
            "param": `**name**:${likeInfo.name}`,
            "smsSignId": "1862a44b70914103a5cb0f3f70ccaff0",
            "templateId": "1f9bad58ce8241b0834310b0fc994dac"
        })
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
const likeNight = () => {
    let today = getToday();
    nightList.forEach(item => {
        if (item.date == today) {
            sendSMS({
                "mobile": likeInfo.mobile,
                "smsSignId": "174d44f20be544e79edf3981a44e37bc",
                "templateId": item.smsid
            })
        }
    })
}
export { likeTips, birthdayOrFestival, likeNight }