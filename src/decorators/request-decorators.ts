import { filter, take } from 'rxjs/operators';
import { Message } from '../models/message';
import { RequestQueue } from '../queues/request-queue';
import { ResponseQueue } from '../queues/response-queue';


export function publisher(topic_key_pairs: string[]) {
    let initialized = false;
    return (target: any, propertyKey: any, descriptor: any) => {
        const businessFn = descriptor.value;
        descriptor.value = function (response_array: any = buildNullArray(topic_key_pairs), args: any = buildNullArray(topic_key_pairs)) {
            let request_maps = buildRequestMaps(topic_key_pairs, args);
            let request_messages = buildRequestMessages(request_maps);
            let response_requests = buildResponseMessages(request_messages, target.constructor.name, propertyKey, this);
            response_array = buildNullArray(topic_key_pairs);
            response_requests.forEach((response_request, index) => {
                subscribeToResponse(response_request, index, businessFn, response_array, target);
            }, target);
            response_requests.forEach((response_request) => {
                RequestQueue.access().publish(response_request);
            });
        };
        return descriptor;
    };
}

export function consumer() {
    let initialized = false;
    return (target: any, propertyKey: any, descriptor: any) => {
        const businessFn = descriptor.value;
        RequestQueue.access().consume()
            .pipe(filter((m: Message) => (target.constructor.name == m.getValue().getTopic() && propertyKey == m.getValue().getKey())))
            .subscribe({
                next: (m) => {
                    //console.log(this);
                    let message: Message = m.getValue();
                    let response_topic = m.getTopic();
                    let response_key = m.getKey();
                    let response_context = m.getContext();
                    let response_value = {
                        id: message.getId(),
                        value: businessFn.bind(target).call(target, message.getValue())
                    }
                    let response = new Message(response_topic, response_key, response_value, response_context);
                    ResponseQueue.access().publish(response);
                }
            })
        return descriptor;
    };
}


function subscribeToResponse(request: Message, index: number, businessFn: any, responses: any[], target: any) {
    ResponseQueue.access().consume()
        .pipe(filter((m: Message) => m.getValue().id == request.getValue().getId()), take(1))
        .subscribe({
            next: (m) => {
                responses[index] = m.getValue().value;
                if (responses.every(function (i) { return i != null; })) {
                    businessFn.bind(m.getContext()).call(target, responses);
                }
            }
        })
}

function buildResponseMessages(request_values: any[], response_topic: string, response_key: string, response_context: any) {
    return request_values.map(request_value => {
        return new Message(response_topic, response_key, request_value, response_context);
    })
}

function buildRequestMessages(request_maps: any[]) {
    return request_maps.map(request_map => {
        let request_topic_key_pair = request_map.topic.split(".");
        let request_topic = request_topic_key_pair[0];
        let request_key = request_topic_key_pair[1];
        let request_value = request_map.args
        return new Message(request_topic, request_key, request_value);
    })
}

function buildRequestMaps(topic_key_pairs: string[], args: any[]) {
    return topic_key_pairs.map((topic_key_pair, index) => {
        return { topic: topic_key_pair, args: args[index] }
    })
}

function buildNullArray(arr: string[]) {
    return Array.apply(null, Array(arr.length)).map(function () { });
}

