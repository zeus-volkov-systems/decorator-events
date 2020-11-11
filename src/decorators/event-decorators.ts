import { filter } from 'rxjs/operators';
import { Message as Event } from '../models/message';
import { EventQueue } from '../queues/event-queue';


export function publisher() {
    return (target: any, propertyKey: any, descriptor: any) => {
        const businessFn = descriptor.value;
        descriptor.value = function (value: any) {
            var event = new Event(target.constructor.name, propertyKey, businessFn.bind(this)(value), this);
            EventQueue.access().publish(event);
            return event;
        };
        return descriptor;
    };
}

export function consumer(subscriptions: string[]) {
    return (target: any, _propertyKey: any, descriptor: any) => {
        const subscription_list = subscriptions;
        EventQueue.access().consume()
            .pipe(filter((event: Event) => (subscription_list.indexOf(event.getTopic() + "." + event.getKey()) > -1)))
            .subscribe({ next: (event) => { descriptor.value.bind(event.getContext()).call(target, (event.getValue())) } })
        return descriptor;
    };
}

