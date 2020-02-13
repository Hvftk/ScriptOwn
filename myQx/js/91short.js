let path = $request.path 
path = path.replace(/&duration=d+/, "")
console.log(path)
$done({path: path});