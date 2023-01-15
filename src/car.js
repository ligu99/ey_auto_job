import { sendMail, sendSMS } from "./utils.js";

const carTip = () => {
    sendMail("415946604@qq.com", "摇号申请延期", "摇号申请延期！摇号申请延期！摇号申请延期！");
    sendSMS("15820950631", "Phil_Lai");
}

export { carTip }