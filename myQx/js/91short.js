let path = $request.path
path = path.replace(/duration=(\d+)/, "duration=300")
$done({ path: path });