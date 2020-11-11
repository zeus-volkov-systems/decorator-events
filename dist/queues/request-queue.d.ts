import { Subject } from 'rxjs';
import { Message } from '../models/message';
export declare class RequestQueue {
    private static instance;
    private static requests;
    private constructor();
    static access(): RequestQueue;
    publish(request: Message): void;
    consume(): Subject<Message>;
}
