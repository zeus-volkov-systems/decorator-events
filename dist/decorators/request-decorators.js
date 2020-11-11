"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = exports.publisher = void 0;
const operators_1 = require("rxjs/operators");
const message_1 = require("../models/message");
const request_queue_1 = require("../queues/request-queue");
const response_queue_1 = require("../queues/response-queue");
function publisher(topic_key_pairs) {
    let initialized = false;
    return (target, propertyKey, descriptor) => {
        const businessFn = descriptor.value;
        descriptor.value = function (response_array = buildNullArray(topic_key_pairs), args = buildNullArray(topic_key_pairs)) {
            let request_maps = buildRequestMaps(topic_key_pairs, args);
            let request_messages = buildRequestMessages(request_maps);
            let response_requests = buildResponseMessages(request_messages, target.constructor.name, propertyKey, this);
            response_array = buildNullArray(topic_key_pairs);
            response_requests.forEach((response_request, index) => {
                subscribeToResponse(response_request, index, businessFn, response_array, target);
            }, target);
            response_requests.forEach((response_request) => {
                request_queue_1.RequestQueue.access().publish(response_request);
            });
        };
        return descriptor;
    };
}
exports.publisher = publisher;
function consumer() {
    let initialized = false;
    return (target, propertyKey, descriptor) => {
        const businessFn = descriptor.value;
        request_queue_1.RequestQueue.access().consume()
            .pipe(operators_1.filter((m) => (target.constructor.name == m.getValue().getTopic() && propertyKey == m.getValue().getKey())))
            .subscribe({
            next: (m) => {
                let message = m.getValue();
                let response_topic = m.getTopic();
                let response_key = m.getKey();
                let response_context = m.getContext();
                let response_value = {
                    id: message.getId(),
                    value: businessFn.bind(target).call(target, message.getValue())
                };
                let response = new message_1.Message(response_topic, response_key, response_value, response_context);
                response_queue_1.ResponseQueue.access().publish(response);
            }
        });
        return descriptor;
    };
}
exports.consumer = consumer;
function subscribeToResponse(request, index, businessFn, responses, target) {
    response_queue_1.ResponseQueue.access().consume()
        .pipe(operators_1.filter((m) => m.getValue().id == request.getValue().getId()), operators_1.take(1))
        .subscribe({
        next: (m) => {
            responses[index] = m.getValue().value;
            if (responses.every(function (i) { return i != null; })) {
                businessFn.bind(m.getContext()).call(target, responses);
            }
        }
    });
}
function buildResponseMessages(request_values, response_topic, response_key, response_context) {
    return request_values.map(request_value => {
        return new message_1.Message(response_topic, response_key, request_value, response_context);
    });
}
function buildRequestMessages(request_maps) {
    return request_maps.map(request_map => {
        let request_topic_key_pair = request_map.topic.split(".");
        let request_topic = request_topic_key_pair[0];
        let request_key = request_topic_key_pair[1];
        let request_value = request_map.args;
        return new message_1.Message(request_topic, request_key, request_value);
    });
}
function buildRequestMaps(topic_key_pairs, args) {
    return topic_key_pairs.map((topic_key_pair, index) => {
        return { topic: topic_key_pair, args: args[index] };
    });
}
function buildNullArray(arr) {
    return Array.apply(null, Array(arr.length)).map(function () { });
}
//# sourceMappingURL=request-decorators.js.map