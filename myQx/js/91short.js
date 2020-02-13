let url = $request.url;
url = url.replace(/&duration=(d+)/g, "")
$done({url});