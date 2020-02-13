let path = $request.path 
path = path.replace(/&dutation=d+/, "")
console.log(path)
$done({path: path});