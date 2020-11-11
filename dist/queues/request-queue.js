"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestQueue = void 0;
const rxjs_1 = require("rxjs");
class RequestQueue {
    constructor() {
        RequestQueue.requests = new rxjs_1.Subject();
    }
    static access() {
        if (!RequestQueue.instance) {
            RequestQueue.instance = new RequestQueue();
        }
        return RequestQueue.instance;
    }
    publish(request) {
        RequestQueue.requests.next(request);
    }
    consume() {
        return RequestQueue.requests;
    }
}
exports.RequestQueue = RequestQueue;
//# sourceMappingURL=request-queue.js.map