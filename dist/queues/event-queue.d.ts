import { Subject } from 'rxjs';
import { Message } from '../models/message';
export declare class EventQueue {
    private static instance;
    private static events;
    private constructor();
    static access(): EventQueue;
    publish(message: Message): void;
    consume(): Subject<Message>;
}
