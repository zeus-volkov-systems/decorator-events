export declare class Message {
    private id;
    private timestamp;
    private topic;
    private key;
    private value;
    private context;
    constructor(topic: string, key: string, value: any, context?: any);
    private setId;
    private setTimestamp;
    private setTopic;
    private setKey;
    private setValue;
    private setContext;
    getId(): string;
    getTimestamp(): number;
    getTopic(): string;
    getKey(): string;
    getValue(): any;
    getContext(): any;
}
