import { Subject } from 'rxjs';
import { Message } from '../models/message';

export class EventQueue {
    private static instance: EventQueue;
    private static events: Subject<Message>;

    private constructor() {
        EventQueue.events = new Subject<Message>();
    }

    public static access(): EventQueue {
        if (!EventQueue.instance) {
            EventQueue.instance = new EventQueue();
        }

        return EventQueue.instance;
    }

    public publish(message: Message) {
        EventQueue.events.next(message);
    }

    public consume() {
        return EventQueue.events;
    }
}