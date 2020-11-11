"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const math_utils_1 = require("../utils/math-utils");
const datetime_utils_1 = require("../utils/datetime-utils");
class Message {
    constructor(topic, key, value, context) {
        this.setId();
        this.setTimestamp();
        this.setTopic(topic);
        this.setKey(key);
        this.setValue(value);
        this.setContext(context);
    }
    setId() {
        this.id = math_utils_1.IdUtils.getRandomUUID();
    }
    setTimestamp() {
        this.timestamp = datetime_utils_1.TimeUtils.getCurrentTimestamp();
    }
    setTopic(topic) {
        this.topic = topic;
    }
    setKey(key) {
        this.key = key;
    }
    setValue(value) {
        this.value = value;
    }
    setContext(context) {
        this.context = context;
    }
    getId() {
        return this.id;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getTopic() {
        return this.topic;
    }
    getKey() {
        return this.key;
    }
    getValue() {
        return this.value;
    }
    getContext() {
        return this.context;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map