# decstreams: typescript event/request decorators for multicast streams

decstreams provides simple event and request decorator pairs for creating asynchronous, decoupled, multicast event stream systems

Current Version (npm install decstreams): 1.0.6

## Why use decstreams

- you want to build an asynchronous system in structured javascript without using promises, async calls, or proprietary constructs like lambda functions
- you want clean separation of responsibility in functions in your code
- you prefer functional, single-responsiblity system design
- you prefer message based architectures (a la kafka, sanicio) and would like something like that in typescript
- you want to take advantage of RxJs streams without complicating business logic
- you want a uniform, clean routing mechanism for your project

## decstream Events

decstream events use a publish/consumer pair in which the publishing function self publishes, and consumers specify what namespaced functions they consume.

To be an event publisher, a function must return a value. It doesn't matter what the value is or what kind of value it is.

To be an event consumer, a function must specify which namespaced function(s) they can consume, and then consume that value as an argument.

Some notes about event publishers and consumers:

- Event publishers know nothing about their consumers. They do processing and return values.
- Event publishers naturally publish to themselves as topics. There is no need to specify a topic to publish (although this may be made an option as a future feature).
- Consumers never know when they are going to get a message. However, when they do, they are guaranteed to process every message.
- Consumers can subscribe to multiple publishers. They will trigger on receiving an event from any of their subscribed publishers.

### Event Usage

Add an `@EventPublisher()` decorator to any function that returns something to stream that return value in the event queue.

Add an `@EventConsumer(["ClassX.functionX", "ClassY.functionY", ...])` decorator to any other function in the namespace.

#### Event Example

Copy/paste this as a new typescript module (index.ts), then compile to js and run using node.

```typescript
import { EventPublisher, EventConsumer } from 'decstreams';

export class GreeterClass {

    @EventPublisher()
    public greetNicely(name:string) {
        return 'Hi, ' + name + '!';
    }

    @EventPublisher()
    public greetAggressively(name:string) {
        return 'Get lost, ' + name + '!';
    }

}

export class HelloClass {

    private static firstName = 'Ryan';
    private lastName = 'Berkheimer';

    @EventPublisher()
    public sayHello() {
        return 'Hello, '+ HelloClass.firstName + ' ' + this.lastName +'!';
    }

}

export class GreetingParser {

    @EventConsumer(["GreeterClass.greetNicely", "GreeterClass.greetAggressively", "HelloClass.sayHello"])
    private logGreeting(greeting: any) {
        console.log(greeting);
    }

    @EventConsumer(["GreeterClass.greetNicely", "GreeterClass.greetAggressively", "HelloClass.sayHello"])
    private reverseGreeting(greeting: any) {
        console.log('Opposite of: ' + greeting);
    }

}

var hc = new HelloClass();
var gc = new GreeterClass();
hc.sayHello();
gc.greetAggressively("Ryan");

/*
After compilation of this example via tsc, the output is:
(base) Faraday:typescript-test rberkheimer$ node dist/index.js
Hello, Ryan Berkheimer!
Opposite of: Hello, Ryan Berkheimer!
Get lost, Ryan!
Opposite of: Get lost, Ryan!

Note that both functions were multicast due to multiple event consumers.
*/

```

**how it works** - In the preceding example, anytime the greetNicely, greetAggressively, or sayHello methods are called, they pass their return values to an event queue. The logGreeting method is subscribed to all of these methods, so whenever the queue has a message with those topics passed, it will trigger. The example demonstrates that any behaviors are supported inside decorators - instance methods, static methods, cross namespaces, etc.

## decstream Requests

decstream Requests are essentially opposite direction events. Request publishers specify an ordered list of the namespaces they want responses for, pass each an optional argument, wait for a return value for each, and then process the functional logic in the request publisher body.

### Request Usage

Add a `@RequestPublisher(["ClassX.functionX", "ClassY.functionY"])` decorator to a function that needs to make requests. Whenever this method is called, it will ship a request for responses from all of the namespaced topics it lists. When it receives all responses, it will process the business logic using an array argument.

Request Publishers take two optional arguments in the decorated function - an array of responses (one for each request consumer, in decorator-listed order), and an array of args (made available by way of the decorator to the request consumer, again in decorator-listed-order). These are optional parameters because request consumers don't have to return any usable values and they don't have to take any arguments.

Add a `@RequestConsumer()` decorator to a function that will serve request responses. Request Consumers take an optional payload (any type, passed to them by the request publisher) and have a return type. Request consumers should handle cases of timeout/bad requests on their own and should always return (but don't have to return any value).

#### Request Example

```typescript
import { RequestPublisher, RequestConsumer } from 'decstreams';

export class UserComponent {

    @RequestPublisher(["UserService.getOldUsers", "UserService.getNewUsers"])
    public printUserLists(responses?: any[], args?: any[]){
        console.log("Old users: " + responses[0]);
        console.log("New users: " + responses[1]);
    }

}

export class UserService {

    private oldUsers: User[]
    private newUsers: User[]

    @RequestConsumer()
    private getOldUsers(args:any) {
      return this.oldUsers;
    }

    @RequestConsumer()
    private getNewUsers(args:any) {
      return this.newUsers;
    }
}
```

**how it works** - In the preceding example, anytime the printUserLists method is called (say, from a linked interactive widget in a UI component), it will publish any provided 'args' through a request stream along with the associated request topics. The request consumers (in this case, getOldUsers and getNewUsers), pick up those requests, use args (or not), and publish a value by returning from the function. The request then processes when all responses are published, and executes any logic using the return data in the response array.

### Installation and Usage

`npm install decstreams`

### Potential Improvements

We welcome community improvements and suggestions. Some things we would like to target eventually are:

- Wildcard event consumer subscriptions (e.g., `@EventConsumer(["GreeterClass.*"])`)
- Data based conditional event consumers (e.g., `@EventConsumer(["message.hasProperty("x")"]`

#### Copyright Zeus Volkov Systems, LLC
