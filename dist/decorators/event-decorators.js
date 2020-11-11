"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = exports.publisher = void 0;
const operators_1 = require("rxjs/operators");
const message_1 = require("../models/message");
const event_queue_1 = require("../queues/event-queue");
function publisher() {
    return (target, propertyKey, descriptor) => {
        const businessFn = descriptor.value;
        descriptor.value = function (value) {
            var event = new message_1.Message(target.constructor.name, propertyKey, businessFn.bind(this)(value), this);
            event_queue_1.EventQueue.access().publish(event);
            return event;
        };
        return descriptor;
    };
}
exports.publisher = publisher;
function consumer(subscriptions) {
    return (target, _propertyKey, descriptor) => {
        const subscription_list = subscriptions;
        event_queue_1.EventQueue.access().consume()
            .pipe(operators_1.filter((event) => (subscription_list.indexOf(event.getTopic() + "." + event.getKey()) > -1)))
            .subscribe({ next: (event) => { descriptor.value.bind(event.getContext()).call(target, (event.getValue())); } });
        return descriptor;
    };
}
exports.consumer = consumer;
//# sourceMappingURL=event-decorators.js.map