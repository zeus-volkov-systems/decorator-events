import { Subject } from 'rxjs';
import { Message } from '../models/message';
export declare class ResponseQueue {
    private static instance;
    private static responses;
    private constructor();
    static access(): ResponseQueue;
    publish(response: Message): void;
    consume(): Subject<Message>;
}
