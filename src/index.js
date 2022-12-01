import schedule from 'node-schedule';
import { reSetAll, eyClock_All, checkClockStatus,pmpClock } from "./utils.js";
import {pmpDoc} from "./pmp.js";
// 自动打卡任务
// 定义规则
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1,2,3,4,5];
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
checkRule.dayOfWeek = [1,2,3,4,5];
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
resetRule.dayOfWeek = [1,2,3,4,5];
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
pmpRule.hour = 0;
pmpRule.minute = 30;
pmpRule.second = 0;
// 执行任务
let pmpJob = schedule.scheduleJob(pmpRule, () => {
    pmpClock()
    pmpDoc()
});


console.log("自動打卡服務已啓動-"+new Date(Date.now()));