import { sendMail, sendSMS } from "./utils.js";

const carTip = () => {
    sendMail("415946604@qq.com", "摇号申请延期", "摇号申请延期！摇号申请延期！摇号申请延期！");
    sendMail("1144575643@qq.com", "摇号申请延期", "摇号申请延期！摇号申请延期！摇号申请延期！");
    sendSMS({
        "mobile": "15820950631",
        "param": `**name**:Phil`,
        "smsSignId": "1862a44b70914103a5cb0f3f70ccaff0",
        "templateId": "2fab793965244c0eb639d5368861565c"
    });
}

export { carTip }