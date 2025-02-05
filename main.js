const https = require('https');
const crypto = require('crypto');
require('dotenv').config();
function sendRequest() {
    let currentTime = Math.floor(Date.now());
    let accesstoken = process.env.ACCESS_TOKEN;
    let appid = process.env.APP_ID;
    let keyid = process.env.KEY_ID;
    let nonce = crypto.randomBytes(16).toString('hex');
    let stringToSign = "accesstoken=" + accesstoken + "&appid=" + appid + "&keyid=" + keyid + "&nonce=" + nonce + "&time=" + currentTime + process.env.APP_KEY;
    let sign = crypto.createHash('md5').update(stringToSign.toLowerCase()).digest('hex');
    let data = {
        "model": "lumi.camera.gwpgl1"
    };
    let params = JSON.stringify({
        "intent": "query.resource.info",
        "data": data
    });
    const options = {
        hostname: 'open-usa.aqara.com',
        path: '/v3.0/open/api',
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Accesstoken': accesstoken,
            'Appid': appid,
            'Keyid': keyid,
            'Nonce': nonce,
            'Time': currentTime,
            'Sign': sign
        },
    };
    return new Promise(function(resolve) {
        var req = https.request(options, (resp) => {
            var data = "";
            resp.on("data", (chunk) => (data += chunk));
            resp.on("end", () => {
                resolve(data);
            });
        });
        req.write(params);
        req.end();
    });
};
async function aqaraRequest() {
    let response = await sendRequest();
    console.log(JSON.parse(response));
};
aqaraRequest();
