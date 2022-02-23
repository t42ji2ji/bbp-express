const express = require("express");
const r = require('request');
const cors = require('cors');

const bodyParser = require("body-parser");
const md5 = require("md5");
const router = express.Router();
const app = express();
const port = 3001

var player_1_money = 10
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const public_key = "LS0tLS1CRUdJTiBwdWJsaWMga2V5LS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFzbDhYejB5dUgrZTNLek0xOHRRUQphL1R0ZG4vVVQ0MXBKaTk0RkRJMkRQQzFVUDNDZ09hamRmY0NHd1NlQmhTbUppbkVLUktJVlRQS0lDb2VqWlhqCkZ1V1p2ampsWU9ycHFxclp0VUhmaytzc2gwMnVodTNKdVVEemgvN2FZVTZVVldGTFI0ckw2TmY0OWswaVdUdjIKUmEzcU5BQ00wN3ZyMUlQMm5lY1hQQnV2aHp6YU5OMWFZNFNKUWNCQmZYNURLSllVZGVhRkpuUjFncVQ3NEw2QQphQnM3NHVrMkVMTWtZTllxdlA3M3NNYWV4c2dLYVFFSjRBU0t1bEZKdTF5SzJIL042b0o1TEFqOUdzeWhzQVU4CmZROGRGZTY0bGFNS04xZ015bkpEb1krRXdBRjdzYmptU3lYVUtqeXQ3TG10bTNyNENmWDBNY1JTUmhMVk8wQzAKZ1FJREFRQUIKLS0tLS1FTkQgcHVibGljIGtleS0tLS0tCg==";
const private_key = "LS0tLS1CRUdJTiBwcml2YXRlIGtleS0tLS0tCk1JSUVvd0lCQUFLQ0FRRUFzbDhYejB5dUgrZTNLek0xOHRRUWEvVHRkbi9VVDQxcEppOTRGREkyRFBDMVVQM0MKZ09hamRmY0NHd1NlQmhTbUppbkVLUktJVlRQS0lDb2VqWlhqRnVXWnZqamxZT3JwcXFyWnRVSGZrK3NzaDAydQpodTNKdVVEemgvN2FZVTZVVldGTFI0ckw2TmY0OWswaVdUdjJSYTNxTkFDTTA3dnIxSVAybmVjWFBCdXZoenphCk5OMWFZNFNKUWNCQmZYNURLSllVZGVhRkpuUjFncVQ3NEw2QWFCczc0dWsyRUxNa1lOWXF2UDczc01hZXhzZ0sKYVFFSjRBU0t1bEZKdTF5SzJIL042b0o1TEFqOUdzeWhzQVU4ZlE4ZEZlNjRsYU1LTjFnTXluSkRvWStFd0FGNwpzYmptU3lYVUtqeXQ3TG10bTNyNENmWDBNY1JTUmhMVk8wQzBnUUlEQVFBQkFvSUJBRWtzNWRHdmZZZXRRZUhCCklwSzZHUHFSQXBJb291cjM4bmt0NUM4MDRpT3c1RkdUcVNYRWVLNitaT2k4bmkrVWJRMGUrVkI0UCtIa1d6bVMKemZINzJhdmRDWk9XTjlQb3kyK3VvNTNPcG5CQ2ZJUU5oRm5xVjJWZWxnbm1yYVJaM2xTZ2s0ZUlFMXMwcnZncwpjTGoyOW5Oamc3OU5zbmh5a2E4ZmJCOGZYTkxWUVY0Y2lZQ2lmV05lL0Y3dmJmV2dFaU1zMHhVQkdwVUdTcmFGCjBES3JtNW1ZUWN4aVlkS1pwYmRBZWg2QndRTmNQaDdEKzdodVhvU0IwNGp3OStqeUNwaHRpMlBaSjYxS1g5VEQKZXhpc1hDb0xlMzY4c3FSSkR4MnRMbWVNZGtyY3dIbFdHVDVCYkZWMndGNW9FLzB4Yy80M0JmdkEwcGFwb1BLLwowWTBQMUNFQ2dZRUF6amJTZC9ZczZ0bWFVeFFsdkN1VDlBbEl0TE96cG5Mb2RIcEV1angyMTNOS2pwbTFseFd1CnhjUXpjRlBYNC8yK2hTcmo0c05Uc2w4NU9ISXhVL2hCQkxUMlJuakEyTlZNbkRkeEpOV1NOaTNvcDFkTk5qc2oKWnloaXJ2c1NEb3ROalVUYjRqRHBBUysxWlBsaHZoNG51aWxWVldnSFk1LzR1UittOFk1RjA5VUNnWUVBM1c5dwpLRmVGbG9DMm9DZTllZE9vVHBpakxsZTV1RThIRlhWZ0R5SlViMzJ6UXJ0dzYyNG9oNmtxRTB1N1dtcHlCakcwClZSU3BPQ3NkWmQ2NzZzWmlLUU1rbzVpalFiVkVRdUpNS0x5L01LMUVFNlp4cUx4TzVFR0VDZUVGVUp4dFpGVUUKUDhsWGlRWW9UTFlZOEN6NU1WdnA2ZFFMM29UWC84cE5Kb2RSYi8wQ2dZQnN4TzN1NktKNG5aNlJBNmVEd1ZpZwo5K1NwcTcrdXBCMklrcFY5eGpiSkhiN055TFhIbzJBMFlIRGhadGdSSWQ1RVQ0TTBNT01NeXIxYjBKL0VNc1hZCnZickpJUmhYUnVySjIxU0tvVHdsNThFM3d3eXU5aktPVHZiK1pOLzVXL0RqK3RZZ1VMd1dMQnY1enJDSG4xQkYKR1ZneFhGWEpicSs2dGI5UTJrSnFvUUtCZ0cwSlpiSUh2dGtvVWtVMHJHRmo3dG1jNGFWOVB3OVpvc1JYUXREUQo5OERhcGIyemJOd1JKMVg5MzZFV3hvKzBJS2VhTEJGRkZqcDVTSVdVRXZaOWIzS0FnTGNwL3lIbzcwNzcvY0tGCmhxT2lmZ1lyRElhcEN6UHNhdWN1Ylo2UEdIS3lSbUJlZFlNY2pCV1NDVitpMWFZUGUzUlBuUFNhZDM0V0VMMXIKSHBmRkFvR0JBSWRSZ212RFFEL2NDZWdCejdhRWpjMHFVK0k2cWVZaVN2aUE0Zk5VVmh4eU5Ndng2NVF6VWF2UQpONW54VFZNcm9scFNOcVFOSmxIdi9BOTJqZ3FySUhRbCtLN09NSytDZkdkc1ptZk40dStuelhXaXBqVU5TQ2tTCklwanlSRE54bW5lWDRySEZraWt0Ukl6S3VoR3RlcnA1Y1lhTjhaVHpYbUNlUmVoYXFIK2IKLS0tLS1FTkQgcHJpdmF0ZSBrZXktLS0tLQo=";


router.post('/transition', (request, response) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  console.log('申請儲值')
  const amount = (1).toFixed(2);
  const currency = "USD";
  const coin_code = "USDT.TRC20";
  const order_id = `${Math.random()}`;
  const product_name = "猜拳遊戲儲值";
  const customer_id = "Player1";
  const notify_url = "http://100f-60-250-130-145.ngrok.io/handle";
  const redirect_url = "https://f0d9-60-250-130-145.ngrok.io/123";
  const lang = 'en-US'

  const signature = md5(
    amount +
    currency +
    coin_code +
    order_id +
    product_name +
    customer_id +
    notify_url +
    redirect_url +
    public_key +
    private_key
  )
  data = {
    'public_key': public_key,
    'amount': 1.00,
    'currency': currency,
    'coin_code': coin_code,
    'notify_url': notify_url,
    'redirect_url': redirect_url,
    'order_id': order_id,
    'customer_id': customer_id,
    'product_name': product_name,
    'lang': lang,
    'signature': signature,
  }

  //-- req
  var options = {
    'method': 'POST',
    'url': 'https://dev-bpay-zfkl7dfcra-uk.a.run.app/v1/payment/transactions',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  r(options, function (error, res) {
    if (error) throw new Error(error);
    console.log(res.body);
    response.send(res.body)
  });
  //-- req
});


router.post('/handle', (request, response) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  player_1_money = player_1_money + (request.body.amount / 1000000)
  console.log('withdrawl success', player_1_money)
  response.send({ data: request.body, code: 200, content: "ok" })
});
router.get('/player1Money', (request, response) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  response.send({ data: player_1_money })
});
router.get('/123', (request, response) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  response.send('Hello World!')
});

// add router in the Express app.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
app.use("/", router);