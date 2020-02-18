import { Subject } from 'rxjs';
import { Message } from '../models/message';

export class RequestQueue {
    private static instance: RequestQueue;
    private static requests: Subject<Message>;

    private constructor() {
        RequestQueue.requests = new Subject<Message>();
    }

    public static access(): RequestQueue {
        if (!RequestQueue.instance) {
            RequestQueue.instance = new RequestQueue();
        }

        return RequestQueue.instance;
    }

    public publish(request: Message) {
        RequestQueue.requests.next(request);
    }

    public consume() {
        return RequestQueue.requests;
    }
}