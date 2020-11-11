import { Subject } from 'rxjs';
import { Message } from '../models/message';
export declare class InitializationQueue {
    private static instance;
    private static directives;
    private constructor();
    static access(): InitializationQueue;
    publish(message: Message): void;
    consume(): Subject<Message>;
}
