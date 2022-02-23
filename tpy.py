import requests
import hashlib
import json
import datetime

def _sigature(amount, currency, coin_code, order_id, product_name, customer_id, notify_url, redirect_url, public_key, private_key):
    return hashlib.md5((str(format(amount, '.2f')) + currency + coin_code + order_id + product_name + customer_id + notify_url + redirect_url + public_key + private_key).encode('utf-8')).hexdigest().lower()

def make_a_tranaction(amount):
    # input your private_key
    private_key = 'LS0tLS1CRUdJTiBwcml2YXRlIGtleS0tLS0tCk1JSUVvd0lCQUFLQ0FRRUFzbDhYejB5dUgrZTNLek0xOHRRUWEvVHRkbi9VVDQxcEppOTRGREkyRFBDMVVQM0MKZ09hamRmY0NHd1NlQmhTbUppbkVLUktJVlRQS0lDb2VqWlhqRnVXWnZqamxZT3JwcXFyWnRVSGZrK3NzaDAydQpodTNKdVVEemgvN2FZVTZVVldGTFI0ckw2TmY0OWswaVdUdjJSYTNxTkFDTTA3dnIxSVAybmVjWFBCdXZoenphCk5OMWFZNFNKUWNCQmZYNURLSllVZGVhRkpuUjFncVQ3NEw2QWFCczc0dWsyRUxNa1lOWXF2UDczc01hZXhzZ0sKYVFFSjRBU0t1bEZKdTF5SzJIL042b0o1TEFqOUdzeWhzQVU4ZlE4ZEZlNjRsYU1LTjFnTXluSkRvWStFd0FGNwpzYmptU3lYVUtqeXQ3TG10bTNyNENmWDBNY1JTUmhMVk8wQzBnUUlEQVFBQkFvSUJBRWtzNWRHdmZZZXRRZUhCCklwSzZHUHFSQXBJb291cjM4bmt0NUM4MDRpT3c1RkdUcVNYRWVLNitaT2k4bmkrVWJRMGUrVkI0UCtIa1d6bVMKemZINzJhdmRDWk9XTjlQb3kyK3VvNTNPcG5CQ2ZJUU5oRm5xVjJWZWxnbm1yYVJaM2xTZ2s0ZUlFMXMwcnZncwpjTGoyOW5Oamc3OU5zbmh5a2E4ZmJCOGZYTkxWUVY0Y2lZQ2lmV05lL0Y3dmJmV2dFaU1zMHhVQkdwVUdTcmFGCjBES3JtNW1ZUWN4aVlkS1pwYmRBZWg2QndRTmNQaDdEKzdodVhvU0IwNGp3OStqeUNwaHRpMlBaSjYxS1g5VEQKZXhpc1hDb0xlMzY4c3FSSkR4MnRMbWVNZGtyY3dIbFdHVDVCYkZWMndGNW9FLzB4Yy80M0JmdkEwcGFwb1BLLwowWTBQMUNFQ2dZRUF6amJTZC9ZczZ0bWFVeFFsdkN1VDlBbEl0TE96cG5Mb2RIcEV1angyMTNOS2pwbTFseFd1CnhjUXpjRlBYNC8yK2hTcmo0c05Uc2w4NU9ISXhVL2hCQkxUMlJuakEyTlZNbkRkeEpOV1NOaTNvcDFkTk5qc2oKWnloaXJ2c1NEb3ROalVUYjRqRHBBUysxWlBsaHZoNG51aWxWVldnSFk1LzR1UittOFk1RjA5VUNnWUVBM1c5dwpLRmVGbG9DMm9DZTllZE9vVHBpakxsZTV1RThIRlhWZ0R5SlViMzJ6UXJ0dzYyNG9oNmtxRTB1N1dtcHlCakcwClZSU3BPQ3NkWmQ2NzZzWmlLUU1rbzVpalFiVkVRdUpNS0x5L01LMUVFNlp4cUx4TzVFR0VDZUVGVUp4dFpGVUUKUDhsWGlRWW9UTFlZOEN6NU1WdnA2ZFFMM29UWC84cE5Kb2RSYi8wQ2dZQnN4TzN1NktKNG5aNlJBNmVEd1ZpZwo5K1NwcTcrdXBCMklrcFY5eGpiSkhiN055TFhIbzJBMFlIRGhadGdSSWQ1RVQ0TTBNT01NeXIxYjBKL0VNc1hZCnZickpJUmhYUnVySjIxU0tvVHdsNThFM3d3eXU5aktPVHZiK1pOLzVXL0RqK3RZZ1VMd1dMQnY1enJDSG4xQkYKR1ZneFhGWEpicSs2dGI5UTJrSnFvUUtCZ0cwSlpiSUh2dGtvVWtVMHJHRmo3dG1jNGFWOVB3OVpvc1JYUXREUQo5OERhcGIyemJOd1JKMVg5MzZFV3hvKzBJS2VhTEJGRkZqcDVTSVdVRXZaOWIzS0FnTGNwL3lIbzcwNzcvY0tGCmhxT2lmZ1lyRElhcEN6UHNhdWN1Ylo2UEdIS3lSbUJlZFlNY2pCV1NDVitpMWFZUGUzUlBuUFNhZDM0V0VMMXIKSHBmRkFvR0JBSWRSZ212RFFEL2NDZWdCejdhRWpjMHFVK0k2cWVZaVN2aUE0Zk5VVmh4eU5Ndng2NVF6VWF2UQpONW54VFZNcm9scFNOcVFOSmxIdi9BOTJqZ3FySUhRbCtLN09NSytDZkdkc1ptZk40dStuelhXaXBqVU5TQ2tTCklwanlSRE54bW5lWDRySEZraWt0Ukl6S3VoR3RlcnA1Y1lhTjhaVHpYbUNlUmVoYXFIK2IKLS0tLS1FTkQgcHJpdmF0ZSBrZXktLS0tLQo='
    # input your public_key
    public_key = 'LS0tLS1CRUdJTiBwdWJsaWMga2V5LS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFzbDhYejB5dUgrZTNLek0xOHRRUQphL1R0ZG4vVVQ0MXBKaTk0RkRJMkRQQzFVUDNDZ09hamRmY0NHd1NlQmhTbUppbkVLUktJVlRQS0lDb2VqWlhqCkZ1V1p2ampsWU9ycHFxclp0VUhmaytzc2gwMnVodTNKdVVEemgvN2FZVTZVVldGTFI0ckw2TmY0OWswaVdUdjIKUmEzcU5BQ00wN3ZyMUlQMm5lY1hQQnV2aHp6YU5OMWFZNFNKUWNCQmZYNURLSllVZGVhRkpuUjFncVQ3NEw2QQphQnM3NHVrMkVMTWtZTllxdlA3M3NNYWV4c2dLYVFFSjRBU0t1bEZKdTF5SzJIL042b0o1TEFqOUdzeWhzQVU4CmZROGRGZTY0bGFNS04xZ015bkpEb1krRXdBRjdzYmptU3lYVUtqeXQ3TG10bTNyNENmWDBNY1JTUmhMVk8wQzAKZ1FJREFRQUIKLS0tLS1FTkQgcHVibGljIGtleS0tLS0tCg=='

    currency = 'USD'
    coin_code = 'USDT.TRC20'
    notify_url = 'https://www.doufupay.io/callback'
    redirect_url = 'https://www.doufupay.io/processing'

    dt = datetime.datetime.today()
    order_id = '{year}{month}{day}{hour}{minute}{second}'.format(
        year=dt.year, 
        month=dt.month,
        day=dt.day,
        hour=dt.hour,
        minute=dt.minute,
        second=dt.second,
    )

    # input your custom id or auto generate
    customer_id = 'customer_id' 
    product_name = '{amount} COIN(S)'.format(amount=int(amount*10))
    lang = 'en-US'
    signature = _sigature(amount, currency, coin_code, order_id, product_name,
                          customer_id, notify_url, redirect_url, public_key, private_key)

    data = {
        'public_key': public_key,
        'amount': amount,
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

    # change url when you're depending on your environment
    target_url = 'https://dev-bpay-zfkl7dfcra-uk.a.run.app/v1/payment/transactions'

    headers = {
        'Content-Type': 'application/json'
    }
    
    resp = requests.post(target_url, data=json.dumps(data), headers=headers)
    
    cashier_url = resp.json().get('cashier_url')
    print( 'result:' )
    print( cashier_url )
    print( resp.json() )

make_a_tranaction(2.0)