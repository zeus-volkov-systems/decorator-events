import { Subject } from 'rxjs';
import { Message } from '../models/message';

export class ResponseQueue {
    private static instance: ResponseQueue;
    private static responses: Subject<Message>;

    private constructor() {
        ResponseQueue.responses = new Subject<Message>();
    }

    public static access(): ResponseQueue {
        if (!ResponseQueue.instance) {
            ResponseQueue.instance = new ResponseQueue();
        }

        return ResponseQueue.instance;
    }

    public publish(response: Message) {
        ResponseQueue.responses.next(response);
    }

    public consume() {
        return ResponseQueue.responses;
    }
}