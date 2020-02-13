var url = $request.url;
if (url.match("91_") || url.match("xj_")) {
	$done({path: ""})
} else {
	$done({})
}