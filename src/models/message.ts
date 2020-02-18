import { IdUtils } from "../utils/math-utils";
import { TimeUtils } from "../utils/datetime-utils";

export class Message {

    private id: string
    private timestamp: number
    private topic: string
    private key: string
    private value: any
    private context: any

    public constructor(topic: string, key: string, value: any, context?: any) {
        this.setId();
        this.setTimestamp();
        this.setTopic(topic);
        this.setKey(key);
        this.setValue(value);
        this.setContext(context);
    }

    private setId() {
        this.id = IdUtils.getRandomUUID();
    }

    private setTimestamp() {
        this.timestamp = TimeUtils.getCurrentTimestamp();
    }

    private setTopic(topic: string) {
        this.topic = topic;
    }

    private setKey(key: string) {
        this.key = key;
    }

    private setValue(value: any) {
        this.value = value;
    }

    private setContext(context: any) {
        this.context = context;
    }

    public getId() {
        return this.id;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getTopic() {
        return this.topic;
    }

    public getKey() {
        return this.key;
    }

    public getValue() {
        return this.value;
    }

    public getContext() {
        return this.context;
    }
}
