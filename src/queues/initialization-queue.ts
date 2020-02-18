import { Subject } from 'rxjs';
import { Message } from '../models/message';


export class InitializationQueue {
    private static instance: InitializationQueue;
    private static directives: Subject<Message>;

    private constructor() {
        InitializationQueue.directives = new Subject<Message>();
    }

    public static access(): InitializationQueue {
        if (!InitializationQueue.instance) {
            InitializationQueue.instance = new InitializationQueue();
        }

        return InitializationQueue.instance;
    }

    public publish(message: Message) {
        InitializationQueue.directives.next(message);
    }

    public consume() {
        return InitializationQueue.directives;
    }
}