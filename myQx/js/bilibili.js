// bilibili 1080+
let body = $response.body
let obj = JSON.parse(body)

const {accept_quality, accept_format} = obj['data']
const hackData = Object.assign(obj['data'], {
  format: accept_format.split(',')[0],
  quality: accept_quality[0],
})

obj['data'] = hackData
body = JSON.stringify(obj)
$done(body)
