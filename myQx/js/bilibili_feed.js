let body = $response.body
body=JSON.parse(body)
const items = body['data']['items']
const filterItems = items.filter(v =>{
    return !v['card_goto'].includes('ad')
})
const newBody = Object.assign({}, body, {data: {items: filterItems}})
body = JSON.stringify(newBody)
$done(body)
