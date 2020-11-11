"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseQueue = void 0;
const rxjs_1 = require("rxjs");
class ResponseQueue {
    constructor() {
        ResponseQueue.responses = new rxjs_1.Subject();
    }
    static access() {
        if (!ResponseQueue.instance) {
            ResponseQueue.instance = new ResponseQueue();
        }
        return ResponseQueue.instance;
    }
    publish(response) {
        ResponseQueue.responses.next(response);
    }
    consume() {
        return ResponseQueue.responses;
    }
}
exports.ResponseQueue = ResponseQueue;
//# sourceMappingURL=response-queue.js.map