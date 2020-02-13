let path = $request.path 
path = path.replace(/&duration=\d+/g, "")
console.log(path)
$done({path: path});