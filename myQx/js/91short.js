let url = $request.url;
url = url.replace(/&duration=(d+)/g, "")
console.log($request.path)
$done({url});