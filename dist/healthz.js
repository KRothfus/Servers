export function handlerReadiness(req, res) {
    res.set({ "Content-Type": "text/html; charset=utf-8" }).send("OK");
}
// keep the streak!
