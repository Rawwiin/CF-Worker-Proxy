const whitelist = ["/bot"];
const tg_host = "api.telegram.org";

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

function validate(path) {
    for (var i = 0; i < whitelist.length; i++) {
        if (path.startsWith(whitelist[i])) return true;
    }
    return false;
}

async function handleRequest(request) {
    var u = new URL(request.url);
    u.host = tg_host;
    if (!validate(u.pathname))
        return new Response("Unauthorized", {
            status: 403,
        });
    u.protocol = "https:";

    const headers = new Headers(request.headers);
    let body = null;
    if (request.method === "POST") {
        body = await request.text();
        headers.set("Host", u.host);
    }

    const req = new Request(u, {
        method: request.method,
        headers: headers,
        body: body,
    });
    const result = await fetch(req);
    return result;
}
