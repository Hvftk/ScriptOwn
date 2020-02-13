let url = $request.url;
url = url.replace(/duration=(d+)/g, "300")
$request.url = url
$done({});