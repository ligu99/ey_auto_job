import schedule from 'node-schedule';
import { reSetAll, eyClock_All, checkClockStatus, expiresTip, fingerTip } from "./ey.js";
import { pmpDoc, pmpClock } from "./pmp.js";
import { likeTips, birthdayOrFestival } from "./like.js";
import { carTip } from "./car.js";
// 自动打卡任务
// 定义规则
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 8;
rule.minute = 0;
rule.second = 0;
// 执行任务
let job = schedule.scheduleJob(rule, () => {
    console.log(new Date(Date.now() + (8 * 60 * 60 * 1000)));
    eyClock_All();
});

// 检查打卡任务
// 定义规则
let checkRule = new schedule.RecurrenceRule();
checkRule.dayOfWeek = [1, 2, 3, 4, 5];
checkRule.hour = 8;
checkRule.minute = 10;
checkRule.second = 0;
// 执行任务
let checkStatusJob = schedule.scheduleJob(checkRule, () => {
    checkClockStatus()
});

// 每日重置打卡状态任务
// 定义规则
let resetRule = new schedule.RecurrenceRule();
resetRule.dayOfWeek = [1, 2, 3, 4, 5];
resetRule.hour = 0;
resetRule.minute = 30;
resetRule.second = 0;
// 执行任务
let resetJob = schedule.scheduleJob(resetRule, () => {
    reSetAll()
});

// 每日PMP打卡
// 定义规则
let pmpRule = new schedule.RecurrenceRule();
pmpRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
pmpRule.hour = 10;
pmpRule.minute = 0;
pmpRule.second = 0;
// 执行任务
let pmpJob = schedule.scheduleJob(pmpRule, () => {
    pmpClock()
    pmpDoc()
});


// 每月提醒
// 定义规则
let likeRule = new schedule.RecurrenceRule();
likeRule.date = [15, 20, 25];
likeRule.hour = 9;
likeRule.minute = 30;
likeRule.second = 0;
// 执行任务
let likeJob = schedule.scheduleJob(likeRule, () => {
    likeTips();
});

// 生日or节日提醒
// 定义规则
let birthdayOrFestivalRule = new schedule.RecurrenceRule();
birthdayOrFestivalRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
birthdayOrFestivalRule.hour = 8;
birthdayOrFestivalRule.minute = 0;
birthdayOrFestivalRule.second = 0;
// 执行任务
let birthdayOrFestivalJob = schedule.scheduleJob(birthdayOrFestivalRule, () => {
    birthdayOrFestival();
});

// 摇号延期提醒
let carRule = new schedule.RecurrenceRule();
carRule.month = [2,5,8,11] // 2,5,8,11月
carRule.date = [1, 2, 3];//1，2,3号
carRule.hour = 10;
carRule.minute = 30;
carRule.second = 0;
let carJob = schedule.scheduleJob(carRule, () => {
    carTip();
});

// 密码过期提醒
let expiresRule = new schedule.RecurrenceRule();
expiresRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
expiresRule.hour = 11;
expiresRule.minute = 0;
expiresRule.second = 0;
let expiresJob = schedule.scheduleJob(expiresRule, () => {
    expiresTip();
});

// 定义规则
let fingerTipRule = new schedule.RecurrenceRule();
fingerTipRule.dayOfWeek = [1, 2, 3, 4, 5];
fingerTipRule.hour = 9;
rufingerTipRulele.minute = [30,40,50];
fingerTipRule.second = 0;
// 执行任务
let fingerTipjob = schedule.scheduleJob(fingerTipRule, () => {
    console.log(new Date(Date.now() + (8 * 60 * 60 * 1000)));
    fingerTip();
});

console.log("自動打卡服務已啓動-" + new Date(Date.now()));