"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventQueue = void 0;
const rxjs_1 = require("rxjs");
class EventQueue {
    constructor() {
        EventQueue.events = new rxjs_1.Subject();
    }
    static access() {
        if (!EventQueue.instance) {
            EventQueue.instance = new EventQueue();
        }
        return EventQueue.instance;
    }
    publish(message) {
        EventQueue.events.next(message);
    }
    consume() {
        return EventQueue.events;
    }
}
exports.EventQueue = EventQueue;
//# sourceMappingURL=event-queue.js.map