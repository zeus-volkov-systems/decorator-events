"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestConsumer = exports.RequestPublisher = exports.EventConsumer = exports.EventPublisher = void 0;
var event_decorators_1 = require("./decorators/event-decorators");
Object.defineProperty(exports, "EventPublisher", { enumerable: true, get: function () { return event_decorators_1.publisher; } });
Object.defineProperty(exports, "EventConsumer", { enumerable: true, get: function () { return event_decorators_1.consumer; } });
var request_decorators_1 = require("./decorators/request-decorators");
Object.defineProperty(exports, "RequestPublisher", { enumerable: true, get: function () { return request_decorators_1.publisher; } });
Object.defineProperty(exports, "RequestConsumer", { enumerable: true, get: function () { return request_decorators_1.consumer; } });
//# sourceMappingURL=index.js.map