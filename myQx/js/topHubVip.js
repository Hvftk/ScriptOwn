// hotHub

let body = $response.body
let obj = JSON.parse(body)

obj['data'] = {
	'vip_expired': '4070883661',
	'is_vip_now': true,
	'is_vip': "1"
}
body = JSON.stringify(obj)
$done(body)
