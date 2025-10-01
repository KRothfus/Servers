export function handlerReadiness(req, res) {
    res.set({ "Content-Type": "text/plain; charset=utf-8" }).send("OK");
}
