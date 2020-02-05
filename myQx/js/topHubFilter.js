// hotHub

let body = $response.body
let obj = JSON.parse(body)

obj['status'] = 200
obj['error'] = false
obj['msg'] = ""

body = JSON.stringify(obj)
$done(body)
