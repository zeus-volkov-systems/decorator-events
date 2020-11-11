"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializationQueue = void 0;
const rxjs_1 = require("rxjs");
class InitializationQueue {
    constructor() {
        InitializationQueue.directives = new rxjs_1.Subject();
    }
    static access() {
        if (!InitializationQueue.instance) {
            InitializationQueue.instance = new InitializationQueue();
        }
        return InitializationQueue.instance;
    }
    publish(message) {
        InitializationQueue.directives.next(message);
    }
    consume() {
        return InitializationQueue.directives;
    }
}
exports.InitializationQueue = InitializationQueue;
//# sourceMappingURL=initialization-queue.js.map