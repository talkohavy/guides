---
sidebar_label: 'Design Patterns'
sidebar_position: 2
# sidebar_class_name: specialSidebarLI
---

# Design Patterns

## **1. Strategy Pattern**

### - A. The Strategy Pattern's Goal  
What is the Goal of the Strategy Pattern?  
This is probably the simplest pattern.  
In short, it is about using composition instead of using inheritance.  
It's about understanding that inheritance is NOT intended for code reuse.  

### - B. Formal Definition  
The strategy pattern defined a family of algorithms, encapsulates each one, and makes them interchangeable.  
Strategy lets the algorithm vary independently from clients that use it.

### - C. The Problem At Hand
The problem at hand is us having Objects with some shared traits, where each trait can either be exactly the same, or just conceptually the same but with a different implementation.  
Also, each object can have more traits than those common ones.

**_<font size="4">Question: Why not inheritance?</font>_**  

**_<font size="4">Answer:</font>_**  The old solution back in the day, when Object Oriented was a huge hype, was with inheritance.  
What is inheritance in a nutshell?  
Consider a Duck class. The Duck class is a super class. The intention is that other classes should inherit from it.  
Duck has 3 methods on it:  
- quack
- display
- fly  

Let's now consider 2 sub-classes: WildDuck & CityDuck.  
In UML, we have 2 types of arrows:  
is-a === ---D  (this is an inheritance arrow)  
has-a === --->   (this is a composition arrow)  
In other words: "A wild duck IS a Duck". "A city duck IS a Duck".  
The sub-classes of Duck are in charge of implementing their own version of the "display" method. And thus, wild ducks can be displayed differently than city ducks.

**<font size="6">The problems with inheritance</font>**  

**<font size="5">_-- Downside 1: Not Resilient to Change_</font>**  
The main problem with it is that sub-classes must inherit ALL of the methods of the parent class, even when it's not logical.
We said that Duck has a "fly" method.
Now consider a new sub-class which is called RubberDuck.
Rubber ducks can't fly, but CityDuck & WildDuck can.
If we were to put the "fly" method on Duck, then RubberDuck would have to inherit it, and implement it. Even if it's not logical.
So yeah, we could think about this things ahead of time, and design properly, but consider a case where this "fly" method is some change that was offered by our product team later on.
This change would break our entire code structure of how we think about Duck.
So we are already seeing that inheritance isn't great with changes.
There IS an ugly solution for this is to force RubberDuck to also implement the "fly" method, and just have it do nothing.

**<font size="5">_-- Downside 2: Code duplication_</font>**  

Horizontal inheritance is not possible. Consider a case where we add 2 new sub-classes (to the already existing sub-classes!): DuckA & DuckB  
Where they both have a "fly" method, which is exactly the same implementation! The "fly" over at Duck is really just the basic definition, so it can't be positioned there. We would need to duplicate the code twice on each of the two classes.  
The ugly, and extremely not feasible solution to this is, we can say that those two classes inherit from let's say a class called FlyingWithTypeA, but you can already see that it's starting to get <font size="5">_**really**_</font> complicated.  
Because consider a case where DuckA & DuckB both has an "eat" method, which are different in implementation, but then DuckB and DuckC has the same "eat" implementation.  
So the problem is, if you image a tree structure, is that inheritance can only be shared downstream the tree. It cannot be shared horizontally.  
That's why composition is often favored over inheritance.

### - D. The Solution: Composition
After reading the problems with inheritance, let's now think about the definition of the Strategy Pattern again:  
_"The Strategy Pattern defines a family of algorithms, encapsulate each one, and makes them interchangeable. Strategy lets the algorithm vary independently from the clients that use it"._  
That's exactly our problem here!  
We have an algorithm for "quacking", we have an algorithm for "flying", and what we're realizing is that we can't create a hierarchical solution in order to share code between these different uses of the different algorithms. so we have to extract the algorithms, and say that each sub-class is actually a "client". A WildDuck is a client. A CityDuck is a client. and they all make use of different algorithms for flying, and quacking, etc.  
And these methods can vary independently from other aspects of the clients.
So what do we do? We create "strategies" for quacking, and "strategies" for flying.
So we'll create Interfaces. For example: IQuackBehavior.  
And what it does is it says - you need to have a "quack" method.  
*** Note: there are many ways of approaching this problem that still adhere to the Strategy Pattern, this is just one of them.  
And then we do the same for "flying".  
We'll create an interfaces IFlyBehavior, that says you need to have a "fly" method.  
Notice the conceptual change, that now we're using a "has-a" relation, instead of a "is-a" relation.  
Now let's consider CityDuck and WildDuck as 2 Clients that should have the a "quack" method, wether it be the same or different.  
How would we achieve that?  
We said that we have an IQuackBehavior interface.  
An interface is not instantiate-able, it needs to have a concretion.  
So we need to create a concretion called SimpleQuackStrategy.  
Now, if those two ducks are the same, they would use that same concretion, and if they're not, we would simply create another concretion, and give it a proper meaningful name.  

• _**The Term "Delegation"**_  
In inheritance, the abstract class Duck had a "quack" method on it.  
With the Strategy Pattern, the "quack" method delegates to the quack behavior to its concretion. So actually, when we run "quack", we would in fact run the "quack" method on SimpleQuackStrategy.  
This is now possible if my Duck has-an IQuackBehavior, which is concreted through SimpleQuackStrategy.  

• _**Why use an interface? Why not just use SimpleQuackStrategy?**_  
Consider a case where Duck points directly to SimpleQuackStrategy, instead of going through IQuackBehavior. Basically just saying "A Duck has-a SimpleQuackBehavior.  
This is a problem, and is really bad, because it is significantly less flexible! This creates class explosions.  
All we need is to know that it is "quackable", so maybe we'll call the interface IQuackable.  

• _**How would the composition work?**_  
With the RubberDuck case we could create a concretion called NoQuack for the "quack" method.  
With the DuckA & DuckB case, each of them would use any concretion that it wants, whether it is for IFlyBehavior, or IEatBehavior.  
Basically what we're doing now is we're taking the "fly" method from the WildDuck class, and placing it in a concretion outside, as if WildDuck client delegates the "fly" ability over to the concretion.  


### - E. Dependency Injection
What we haven't talked about is Dependency Injection.  
We sort of glanced over this.  
`Dependency Injection` is only possible IF these behaviors are somehow injected into an instance of a duck, and not hardcoded in the class. if the class hardcodes these things, then we can't do that anymore.  
To make this perfectly clear:  
```javascript
// *** THIS IS BAD ***

class Duck {
  IFlyBehavior fb = new SomeParticularFlyBehavior();
  IQuackBehavior qb;
  IDisplayBehavior db;
}
```

If we did this, if we were to hardcode the dependency, it wouldn't be as flexible. It would put me back in a state where I need multiple classes to represent all of these different types of Ducks. Think about it, it is significantly less composable.  
We need to somehow inject the behavior.  

```javascript
// *** THIS IS GOOD ***

class Duck {
  IFlyBehavior fb;
  IQuackBehavior qb;
  IDisplayBehavior db;

  constructor({ fb, qb, db }){
    this.fb = fb;
    this.qb = qb;
    this.db = db;
  }
}
```

The key here is to use the constructor injection.  
And now think about how the "fly" method on that class would look like:  

```javascript
public void fly(){
  this.fb.fly()
}
```

So you pass in the behavior, and then you execute that behavior within the class.

---

## **2. Observer Pattern**

### - A. Definition
The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, all of its dependencies are notified, and are updated automatically.

The Observer Pattern introduces a few new terms:
- Observer
- Observable
- Register
- Push V.S. Poll

In the Observer Pattern, we have 2 objects.  
One object is the Observable.  
The Observable is simply an object with a state, and its state changes changes over time.  
The Observer is just an object that needs/wants to know, for some reason, when the state of the first object, the Observable, has changed.  
So we have a relationship between an Observable & an Observer.  

### - B. Push v.s. Pull

The Observer Pattern is essentially about going from a Polling architecture to a Push architecture.  
Now these terms are usually more used in terms of networking architectures, and web service, and etc. This is just an analogy.  

### - C. The Pull Method

The Observer want to know about the state of the Observable.
So what can it do? We could have the Observer ask the Observable "Hey, did you change state?" over and over again, at fixed intervals, and it would have to do that indefinitely.  
But how will we choose what this fixed interval be?  
A second?  
A half a second?  
A long fixed period of time could potentially create a huge delay in response.  
And if we were to choose an extremely short period of time, let's say 1 millisecond, it would solve the delay issue, but would cause another major issue of overloading on the system.  
And this is just talking about one Observer!  
Consider a case where we have a hundred Observers. They would all want to know if the Observable state had changed, so they would all ask in polling "have you changed state?", and in the next millisecond they would all do the same again. The overload would be insane.  
The Observer Pattern helps us move from the polling onto pushing.  
Instead of the observer constantly asking "has your state changed?", the first object is responsible for telling all of its subscribers, the observers which observe it, when it has changed.  

### - D. We need to Register

What we've seen up until now, in essence, this is the entire Observer Pattern. But! There's a problem now.  
How would the Observable, whose state has changed, know... who all of its subscribers are? in order to do all of the pushing?  
Somehow all of the subscribers need to register to the subject.  
In many textbooks, and programming language, the Observable is often considered as "the subject".  

### - E. Variations of the Observer Pattern
Different programming languages have different default implementations of the Observer Pattern, and therefore different people draw different diagrams, because there are variations of Observer Pattern. Each of course has its advantages and disadvantages.  
We will talk about the one found in the book of "Head First - Design Patterns", and then discuss what the benefits of the approach that they are suggesting. And then we would also look at a slight variation.  


An IObservable has the following functions:
 - `register(IObserver)`
 - `unregister(IObserver)`
 - `notifyBroadcast()`

An IObserver has the following function:
 - `update(changes)`

So, basically, an Observable holds a list of all Observers that registered to it.  
New Observers can register to it, and existing Observers can unregister from it.  
Upon calling the Observable's notifyBroadcast, it goes over all Observers that are registered to it, and notifies them on the change.  
And how it does that?  
It simply calls their _**update()**_ function.  

**_<font size="6">Summary Example</font>_**  

A chat room is a good example for using the Observer Pattern.  
The Observer Pattern is a very suitable pattern for chat systems.  
If you think about it, you have a Chat Room, which is an Observable, and then you add in Observers to the Chat Room. And then whenever a user broadcasts a message, or I should rather say "simply sends a message", the Observable calls the notify function, so that all of the clients that are connected to the Chat Room can get the latest message that has been sent, i.e. broadcasted by one of the users.

<br/>  

---

## **3. Decorator Pattern**

### - A. Definition
The Decorator Pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to sub-classing, or to extending functionality.

### - B. Simple Explanation
You have an object, and instead of sending messages to this object, like for instance `speak()`, and then you expect to get something back, let's say `hello world!`.  
Decorator Pattern is saying: if I want to change the thing that's returned, if I want to change the behavior of this method, I could actually do that at runtime, without changing the contents of this particular object. The important thing to realize is that the change occurs at **runtime**, and not at **compilation time**.  
So, with Decorator Pattern, what we do instead is we say "Let's actually wrap this object in another object. And when I send the message `speak()`, i'll send the message to the outer object, who will send the message to the inner object, who will send the message back to the outer object, who will return it back to me.  And it will keep on doing that indefinitely.  
So that's the essence of the Decorator Pattern.
The Decorator Pattern supports convolution, and what that means is that a decorator can wrap a decorator.

**Let's look at a JavaScript example:**

```javascript title="javascript"
const mySymbol = Symbol("mySymbol");

function myDecorator(target) {
  // Add a property with the symbol as the key
  target[mySymbol] = "This is a symbol property";
}

@myDecorator
class MyClass {
}

console.log(MyClass[mySymbol]); // Outputs: "This is a symbol property"
```

--- 

## **4. Factory Pattern**

We will talk about 2 versions of the Factory Pattern:
1. `Factory Method`
2. `Abstract Factory`


### - A. Factory Method Pattern
Let's first start with a little bit of narrative. Why do we need the Factory Method Pattern? Why do we need a concept called a Factory?  
Think about it this way... In our code, we use lots of different objects. In Object Oriented Programming we have classes, and we instantiate objects from these classes, and then we use these objects in a bunch of different ways.  
Now, earlier in the course we discussed `Dependency Injection` (in the [Strategy Pattern](#1-strategy-pattern "Go to the Strategy Pattern")), and what we were doing there is programming by wishful thinking. We were saying "When i'm in this particular method, instead of constructing some logic right there and then, let's imagine that I already have a thing that does such and such, and that thing was passed to me via the constructor, and use that instead.  
Basically you can think about `dependency Injection` as "programming via wishful thinking".  
That thing being passed, needs to be constructed somewhere....


**Definition**  
The Factory Method Pattern defines an interface for creating an object. But! it lets sub-classes decide which class to instantiate. Factory Method lets the class defer instantiation to sub-classes.

Let's dig through dig line by line:  
_Quote: The Factory Method Pattern defines an interface..._  
Where their saying an `interface` they don't necessarily mean the keyword `interface`, like they don't mean an interface as in `class` `interface` `abstract class` sort of way, but rather an interface in the sense of a contract. A common contract under which you can refer to this particular thing. In other words, it could be an interface, but it could also be a superclass.  
_Quote: ...for creating an object._  
The key point of Factory Pattern is that in the end, you want an object. You don't necessarily know _how_ you want to construct that object, _why_ you want to construct that object, and _what_ parameters you want to pass when constructing that object. These are all unknowns, and that's why you want to defer, why you wanna let somebody else take that decision. 
_Quote: ...But! it lets sub-classes decide which class to instantiate._  
It's not only about which class to instantiate, it's also about what you want to pass to that class that you're instantiating.  
_Quote: ...Factory Method lets the class defer instantiation to sub-classes._  
Honestly, i'm not entirely sure what they mean here. I'm not sure if they mean that the common ancestor, defers the decision to the sub-classes, or whether they simply mean that whoever is using the factory defers to these factories. But since they're saying sub-classes, they probably mean that the animal factory does not have to make the decision about which of the Animal classes to instantiate, and what to pass to it when instantiating, but rather that these sub-classes decide which object to construct and how.

Lets create the UML:  

<!-- △▲ ▷▶ ▽▼ ◁◀ -->
<div style={{border: '1px solid black', borderRadius: '5px', padding:'20px'}}>
  <div style={{display: 'flex', alignItems: 'center'}}>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        Factory
      </div>
    </div>
    <div style={{width: '200px'}}/>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        Product
      </div>
    </div>
  </div>

  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '200px'}}>
      <div>△</div>
      <div>|</div>
      <div>|</div>
      <div>|</div>
    </div>
    <div style={{width:'200px'}}></div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '200px'}}>
      <div>△</div>
      <div>|</div>
      <div>|</div>
      <div>|</div>
    </div>
  </div>

  <div style={{display: 'flex', alignItems: 'center'}}>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ConcreteFactory
      </div>
    </div>
    <div style={{width: '200px', textAlign: 'center'}}>— — — — — — — — —▷</div>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ConcreteProduct
      </div>
    </div>
  </div>
</div>

### - B. Abstract Factory Pattern

**<font size="5">Intro</font>**

The Abstract Factory Pattern is extremely similar to the Factory Method Pattern.  
Actually, in some sense, an Abstract Factory is a set of Factory Methods.  
So an Abstract Factory makes use of multiple Factory Methods.  

**<font size="5">Formal Definition</font>**

The Abstract Factory Pattern provides an interface for creating families of related or dependent objects without specifying their concrete class.

**<font size="5">Simple Words Explanation</font>**

So, if you contrast this to the Factory Method Pattern, te single difference between these two is that the Factory Method Pattern constructs a `single` object, where-as the Abstract Factory Pattern constructs `multiple` objects.  
And why is this a good thing?  
Consider a case where your factory creates UI controllers, Like an AlertBox and an AcceptButton for that AlertBox.  
Now let's imagine that you can create an AlertBox for Windows, an AlertBox for Macos, and an AlertBox for Linux. And the same logic also applies to the AcceptButton.  
With the Factory Method Pattern, you would have an IFactory for each of them, and you would be able to create illogical situations, like a combination of an AlertBox for Linux, and an AcceptButton for Windows.
So how does the Abstract Factory Pattern prevent that?
In the IFactory of an Abstract Factory Pattern, you have a method for both methods, one for creating an AlertBox and one for creating an AcceptButton. Then, in your concretion, in your actual factory, you could implement one factory for Windows components, one for Linux, and one for Macos.  
Remember the definition of the Abstract Factory Pattern: The Abstract Factory Pattern provides an interface for creating **families** of **related** or **dependent** objects without specifying their concrete class.

So now, instead of having 1 factory for each product, we have 1 factory for each family of Products. That way, we prevent illogical mixes and matches.

---

## **5. Singleton Pattern**

### - A. Formal Definition

The Singleton Pattern a class has only 1 instance, and provides a global point of access to it.

### - B. Simple Explanation

So the Singleton Pattern helps you to make it impossible to instantiate a class, except for a single time. And whenever you want an instance, you will inevitably have to use that instance. The way it works it such that whenever you ask for an instance, you always get the same instance. S2 there's actually two points to it: one is about making sure that you only ever have a single instance, and the other is providing a global access to that instance.

### - C. Reasons Why You should Never Use It

Many people argue that you should never use the Singleton Pattern.  
Why?  
Well, one of the first things we learn when we talk about programming is to avoid globals. We much rather prefer to scope variables and functions, so that not everything is leaking into the global namespace. For one because it's hard to control, and things might be ambiguous.  
But probably more importantly, whenever you leak something into the global namespace, and make it globally accessible, that thing might change without you knowing it. It's much harder to reason about your program, when you don't have control of the scope of the variable that you're interacting with, anyone within that whole program might change that variable, assuming it's change-able of course.  
The second point about making sure that you only have a single instance, that too is kind of an absurd idea. If you think about it, that's an assumption! You're *assuming* that in the future I will only ever ever need a single instance of this particular class. That isn't necessarily true! Especially if your application is growing. For an example, think about a chat application. So at first you might think that a Chat is a singleton. Like, you want to be able to reference the chat in which users are, wherever in the program. So to make it convenient for yourself, you make a singleton, with a global point of access, to this instance of the Chat, but then as time progresses, you start to realize that actually, we're being very successful with this chat

### - D. How to implement a singleton pattern
The key about singleton pattern is that the constructor of the singleton we make private. This was crazy back in the day, because the constructor is public so that you can construct instances of the object. But, you can actually make the constructor of a class private. Which means that from the outside people can't construct that class. The can't say "new Singleton()". Only singletons can instantiate Singletons. But if you can't make a Singleton but saying "new Singleton()", then you have no singletons that can make singleton. So now you're in a situation where you're saying "well, then how do I create the first singleton?"  
That's when **Static methods** come in.  
Once again, a lot of people argue you should never use static methods.  
But that's when we use static methods. Because a static method is a *class* method. A static method on the class singleton is still within sort of the namespace of the singleton, which means that it actually has access to the private constructor of the singleton.
Let's look at a diagram:

<div style={{border: '1px solid black', borderRadius: '5px', padding:'20px'}}>
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '250px', height: '120px'}}>
      <div style={{width:'100%', borderBottom: '1px solid', borderColor: 'inherit'}}>
        Singleton
      </div>
      <div style={{width:'100%', borderColor: 'inherit', textAlign: 'left', padding: '10px'}}>
        static function getInstance(){}
      </div>
    </div>
  </div>
</div>

So the singleton has a static method that returns a singleton. In other words, it returns an instance of this class in which it resides. We'll call that function **getInstance**.  
The singleton is a class, that has a static method, called `getInstance`, and when you call that static method you get back an instance.
```javascript
Singleton.getInstance()
```

Notice that we're not instantiating a singleton like so:
```javascript
Singleton s = new Singleton()
s.getInstance()
```

The second important piece is that the Singleton then has static variable, which we'll name `instance`, of type *Singleton*, which is eventually gonna be the instance. The variable is also marked as private, so you wouldn't have access to it without going through the `getInstance` method.  
Now, what `getInstance` would then do is check if there's an instance within this static variable called `instance`, that holds a variable of type Singleton. If it does exist, it would return that instance. But if it doesn't exist... it will instantiate it, and save it into this variable. So the next time we'll call `getInstance`, there is a variable.

Full implementation:
```java
public class Singleton {
  private Singleton(){}

  public static Singleton getInstance(){
    if(this.instance == null){
      this.instance = new Singleton();
    }

    return this.instance
  }

  ...
}
```


--- 

ore 
## **6. Action Pattern**

### - A. Description

### - B. More Details
We construct the command, we inject the command, into the invoker, and whenever the invoker invokes the command, we execute that command, and that command might do something to something else. In the book they call this *something else* the **Receiver**. You can have tons of invoker, that are just coupled to command. Any command can do anything it wants to any particular receiver. And if you're sharing interfaces with receivers maybe you could even use the same receiver for multiple commands.
Let's talk about the diagram:  
We have an `Invoker` and a `Command`.  
An `Invoker` has zero-to-many commands.  
But not concrete commands. It couples to the interface `ICommand`.  
The interface `ICommand` then of course has a number of implementations, and these we call `Commands`.  
And any particular command acts upon (has) a `Receiver`.  
An example would be a remote control, an *on* button, and a lamp.  
In this analogy, the remote control is the `Invoker`, the invocation occurs when pressing the button, which sends a `command`, and the `Receiver` is the lamp.  
So basically the remote control is loaded with commands, or actually ICommands, and because the ICommand is an interface, it needs to be implemented by something, by any particular concrete command, and this command could be like a "turn on light" command, or "set color of light".  
Then, this command precedes to act upon some particular receiver.  

Let's now talk about the methods on each:  
- The `Invoker` has a `setCommand`, which takes in an `ICommand`.
- The `ICommand` has 2 methods: `execute` & `unExecute`. One is the inverse of the other. One does the thing, and the other undo's the thing.
- And then of course any concrete command needs to implement these 2: `execute` & `unExecute`.  
The `execute` function is void, meaning it doesn't return anything.  
And most importantly, they take no arguments. Because the command itself has encapsulated all of the things it needs to perform its duties. There's an action encapsulated in the command.  
The concrete `Command` has an instance of the `Receiver` stored within it. We pass the receiver to the constructor.

```javascript
/** @implements {ICommand} */
class Command {
  /** @private */ 
  receiver;

  constructor({receiver}){
    this.receiver = receiver;
  }

  execute(){
    this.receiver.on();
  }

  execute(){
    this.receiver.off();
  }
}
```

The `Invoker` is not actually part of the pattern.  
Only the `Command` and the `ICommand` are the actual pattern, but nevertheless, let's look at how the `Invoker` class would look like anyway:

```javascript
class Invoker {
  /** @type {ICommand} */
  on
  /** @type {ICommand} */
  off
  /** @type {ICommand} */
  dimUp
  /** @type {ICommand} */
  dimDown
  
  constructor({on,off,up,down}){
    this.on = on;
    this.off = off;
    this.up = up;
    this.down = down;
  }

  clickOn(){
    this.on.execute();
  }

  clickOff(){
    this.off.execute();
  }

  clickUp(){
    this.up.execute();
  }

  clickDown(){
    this.down.execute();
  }
}

const light = new Receiver()
const invoker = new Invoker({
  on: new LightOnCommand(light),
  off: new LightOffCommand(light),
  ...
});
```


--- 


## **7. Adapter Pattern**

### - A. Introduction

There are 4 patterns that are easily get confused are:
1. Adapter Pattern
2. Facade Pattern
3. Proxy Pattern
4. Decorator Pattern

We've already seen `Decorator Pattern`.  
In the lecture we're going to talk about the `Adapter Pattern` only.

The `Adapter Pattern` is also known as a (simple) Wrapper.  
The `Adapter Pattern` sort of wraps something, 


### - B. Formal Definition

The `Adapter Pattern` converts the interface of a class into another interface which the client expects. Adapter lets classes work together that couldn't other-wise because of incompatible interfaces.

### - C. Code Implementation

```javascript
class Client {}

/** @implements {ITarget} */
class Adapter {
  constructor({adaptee}){
    this.adaptee = adaptee;
  }

  request(){
    this.adaptee.specificRequest();
  }
}

class Adaptee {
  constructor(){}

  specificRequest(){}
}

const client = new Adapter({ adaptee: new Adaptee() });
client.request();
```

The `Client`, the user of the code, has something of type `ITarget`. This `ITarget` has a method called `request`. The `request` is the standard that we're used to using. But, because we want to use something that has a completely different interface, an `Adaptee`, we can't just call `request`, because `Adaptee` has no method called `request`, `Adaptee` has a method called `specificRequest`. So, what we do is we invoke the `request` method, but! we invoke it on an `Adapter`. The `Adapter` is follows the signature of the thing that we're used to using, it follows the signature `request`. So we can call `request`, and then count on the `Adapter` to call the `Adaptee`. The `Adapter` has an `Adaptee`, so it is responsible for delegating the request down to the `Adaptee`, and then the `Adaptee` can perform that specific action that we're originally interest in.  
So, for some reason, the `Client` wants to call this `specificRequest`, but! for some other reason it wants to call it using this particular signature of `request`.  

What are some of the reasons that this happens?
* It could be that this `Adaptee` is an external library that we don't actually have control over, and we're not sure that we're going to use that specific library, forever and ever, so we **wrap** an `Adapter`, we put an `Adapter` in-between the two, so that if we change our mind about what we want to adapt to (change our adaptee) in the future, then we can in a somewhat trivial way change that, because we can switch up the `Adapter`, or we can modify the `Adapter` code itself.
* It could be that this particular `request` is scattered in many places, so it would be painful for us to go and change it to the style of `specificRequest`.
* Or, we could in-vision that in the future we might actually want to change the signature of `specificRequest`, so we want to encapsulate this potential change in a place where it would be easy for us to change in the future.


**IMPORTANT NOTE**

The intention of the `Adapter Pattern` is to NOT change the underlying behavior. You adapt something. You have an adapter which you stick in-between two things, but the intention is not to add behaviors, or to remove behaviors, it's not to alter behaviors. The intention is really to somewhat blindly just pass on the request. The point is that you have two types of signatures, 2 different types of interfaces, and the interfaces don't connect. They are not inter-operable, so the intention is to make them operable.  

Here's an example of something that looks like an adapter but isn't an adapter.  
Different countries have different voltages in the outlets. In europe they have one voltage in the wall outlet, and in the USA you have a different voltage coming out of the outlet. Now, probably in any modern device there's a charger which contains a transformer. The point is, if we did have this transformer it would be potentially dangerous for our devices to simply stick an adapter, on the pins and then connect to the socket, unless we didn't have this transformer to also transform the voltage to what was expected by our device. So, if that were the case, if we didn't have this transformer, and we needed to, in other words, alter the behavior, then we're not talking about an adapter. We're talking about something else. Potentially, we're talking about a decorator. The transformer is not an adapter.


--- 


## **8. Facade Pattern**

### - A. Introduction

Facade pattern is really really easy.  
If you've got a bunch of things, which let's from now own call classes.  
And you have a bunch of different interactions between those classes.  
Now, let's imagine that outside you've got a `client`, not in the sense of a user, but in the sense of a particular piece of code, and this client wants to use some of the classes within this cluster.  

### - B. Definition

The Facade Pattern provide a unified interface to a set of interfaces in a sub-system. Facade defines a higher level interface that make the sub-system easier to use.



---



## **9. Proxy Pattern**

### - A. Definition

The proxy pattern provides a surrogate, or a placeholder, for another object to control access to it.

So basically, with the proxy pattern we're trying to solve a specific set of problems that are all access-related. So, you put a proxy in front of something that you want to allow people to access, but you have the proxy so that you can control who has access to that thing.

In the books, they talk about 3 ways of approaching this pattern:
1. A Remote proxy
2. A Virtual proxy
3. A Protection proxy


### - B. Remote Proxy

A remote proxy is suggested to be used when you want to access a resource that's remote. For example that lives on a different server. So, somehow you have to leave the safe boundary of your application, out into the outside world, in order to retrieve some information back. So this interaction/transaction count be wrapped in a proxy. Your proxy is responsible for this interaction, or for interacting with this remote resource and giving you back the things that you need. If you're familiar with `Promises` that are commonly used in JavaScript, then I like to think of it as in like the proxy is something that would interact with a remote resource but immediately returns/gives you a promise. And this `promise` promises to evaluate to the concrete resource that you were looking for, after a a while.


### - C. Virtual Proxy

A virtual proxy controls access to a resource that is expensive to create.  
This is exactly `caching`, if you think about it.

So you've got some object that you know you want to interact with, but you know that creating that object is expensive, so you put something in front of that object, with which can interact with instead - a virtual proxy. So then, that proxy, makes sure that only when you really really need it, you interact with the actual underlying object.
So it's kind of like "lazy evaluation".

As opposed to the other 2 types of proxy pattern, we will dig deep into this one - the `virtual proxy pattern`, and see a code example.

Code Example:

```java
String book = "..."; // <--- a REALLY long string which represents a book!

BookParser bookParser = new BookParser(book);

bookParser.numOfPages();
bookParser.numOfChapters();
bookParser.numOfNouns();
bookParser.numOfAdverbs();
```

Now let's say that for some reason, these following assumptions take place:
* You cannot change the implementation of BookParser (perhaps it's a third-party lib)
* The parsing of a book is computationally heavy
* The callings for those methods is O(1)
* There are more than 1 instantiations of the BookParser.
* There are times where a book is parsed, however none of its methods aren't being called

Given these assumptions, we can understand that we have a performance issue.  
Probably the rational solution is to refactor the BookParser, and make it *lazy*. I would say that this is the better solution. To make the cost occur in its methods, and not in its instantiation. But, as we said, maybe the BookParser belongs to some third-party library. There could be multiple reason as to why we don't want to change the BookParser.

So, another way of solving this problem would be using proxy pattern.  

Well, first we need to recognize it's a problem. Perhaps you've heard the term `pre-mature optimization`. It's when you attempt to increase the performance of your application before you know you actually have a performance problem.

So how do we do this?  
What we can do is stick a proxy in-between whoever called the BookParser.  
So, as usual, you have a client, and this client is used to using the BookParser. Let's say that it first instantiated it, and then it calls one of these methods. And we know that the instantiation one is the costly one, and that the calling is the cheap one. And we also know that we won't always call this "cheaper" method. So, the hypothesis of how we can improve the performance is that we want to say that constructing... should **only** happen, if you actually want to call the method. So we want to defer, we want to make it lazy. And that's why we want to stick a proxy in-between.  
The solution:

|client|----->|proxy|----->|BookParser|
|-|-|-|-|-|

So you've got the client, but instead of the client directly interacting with the BookParser, we interact with the proxy, who interacts with the BookParser. So the client actually instantiate a proxy. The proxy *doesn't* instantiate a BookParser, because the proxy says "I don't know if you're actually gonna call any of these methods that require me to parse this book, so I'll until you tell me that I need to parse, because you want some piece of information". It's important to note that the proxy would follow the same interface as the BookParser, that going back to the idea that the proxy has the same interface as the one it's proxy'ing into.

So now, instead of the client calling directly to the BookParser, to instantiate it, it makes the call to the thing that it thinks IS a BookParser, which is actually the proxy, and it would defer the instantiation process for later. Only when the client makes the call to one of the methods (i.e. numOfPages), the proxy would say "Ah! you now actually want some of this information? which requires me to actually do the parsing?" so then the proxy will simply do this call of instantiation, which parses the book, and invoke this heavy expensive computation, and then immediately after that make the call to the cheap method and simply pass the object backwards to the client who made the call.

Now, of course, as you might have guessed, we would construct the proxy to be smart enough to not re-build the BookParser every time we make a new call, because then obviously performance will be worse than in the beginning. The proxy has to cache the BookParser. The proxy builds the BookParser only the first time, and actually maintains a reference to that BookParser, so that the second time we make a call to the same method, or even to another method, then we simply already have a BookParser and we can then simply make that quick call to the BookParser.


### - D. Protection Proxy

A protection proxy is sort of an *access management*. It controls access to a resource based on access rights. So, you've got a user, and you're not sure whether your particular user has the rights to access a particular resource. So, you stick this protection proxy in-between, and that protection proxy makes sure that only users that are allowed to access the underlying resource do get access to the underlying resource.

### - B. Differences between...

It's not only about how you string the objects together, it's also about the *intent*.  
Like, some patterns are mostly different in their intent, rather than in the technicalities. So, they might be doing the same thing on the surface, but what's different is that you are doing it for a different reason. So you might use the word *proxy* to other developers, what kind of problem you're trying to solve, and then  you might use another word to communicate to other developers that you're trying to solve a different kind of problem.

One of the key things of the proxy pattern is that the proxy pattern looks like the remote resource. It looks like the thing that it's proxy'ing to. But if you think about the adapter pattern, an adapter pattern adapts to a different interface. An adapter pattern let's you say that you want to access a thing that has some particular interface but you have a different interface, and you wanna access it via your interface. Proxy pattern however is simply a way of controlling the access, so it doesn't change the interface. So you have something that you want to interact with, that has some particular interface, and you don't want to change the interface, you simply want to intercept the accessing of the thing you want access for some reason, such as security, or caching, or whatever.

What the proxy pattern does is it adds some additional behavior, not in the sense of a decorator pattern, but in the sense that it adds additional behavior with the *intent* of controlling access to the underlying object. So, both proxy and decorator patterns add additional behavior, but decorator is much more general, and is designed so that you can stack decorators one onto another, whereas proxy pattern simply says that... for some reason you need to control access to some underlying object, and because of that, you need to add additional behavior, but! you don't want to change the interface. You want to interact with the thing, in the same way that you've always interacted with the thing, as if it were the real thing, but! you want to add some additional behavior, just before you make calls to it.

---



## **999. Bridge Pattern**
### - A. What is the Goal of the Bridge Pattern?
The intent of the Bride Pattern is to decouple an abstraction from its implementation so that the two can vary independently.  

### - B. The interface segregation principle
The interface segregation principle states that clients should not be forced to depend on method that they do not use.  
For example, Book should no be forced to depend on the method getBio, just because Artist wants to have the method getBio. because books don't have biographies. Authors of books have biographies. So that might be a good reason for not mixing Artist & Book, and leave them as separate.  

• Abstraction
• Concrete Abstraction
• Implementor
• Concrete Implementor

An abstraction has a single implementor.  
An abstraction is an abstract, so in order for it to be used, we need to use any of the concrete abstractions.  
The implementor too is an abstraction, so any concrete abstraction needs to have, a concrete implementor.  

Example:  
Abstractions are Views.  
Implementors are Media Resources.  
Concrete Abstractions are: LongFormView, ShortFormView  
Concrete implementors are: Artist Resource, Book Resource.  
A little bot of an "outside of scope" material, think about the Artist Resource... It could actually adapt over an Artist. which what i really meant is a concretion. so we might have a concretion called an Artist, and then the Artist Resource would have an Artist, and not have an abstraction that is shared amongst these resources. To continue this example, we might have another concretion called a Book, and then we'd say the Book Resource has a Book. So the Artist Resource adapt over an Artist, and the Book Resource adapts over a Book. This is how we make the Artist Resource and the Book Resource behaviorally different. There is some behavior that is fundamentally different.  
In the same way, LongForm is fundamentally different from the Short Form. And it really is, except the methods.  


<!-- △▲ ▷▶ ▽▼ ◁◀ -->
<div style={{border: '1px solid black', borderRadius: '5px', padding:'20px'}}>
  <div style={{display: 'flex', alignItems: 'center'}}>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ???
      </div>
    </div>
    <div style={{margin: '10px'}}>— — — — — — — — —></div>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ???
      </div>
    </div>
  </div>

  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '200px'}}>
      <div>△</div>
      <div>|</div>
      <div>|</div>
      <div>|</div>
    </div>
    <div style={{width:'200px'}}></div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '200px'}}>
      <div>△</div>
      <div>|</div>
      <div>|</div>
      <div>|</div>
    </div>
  </div>

  <div style={{display: 'flex'}}>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ???
      </div>
    </div>
    <div style={{width:'200px'}}></div>
    <div style={{textAlign: 'center', border: '1px solid black', margin: '0', borderRadius: '5px', borderColor: 'inherit', width: '200px', height: '100px'}}>
      <div style={{borderBottom: '1px solid', borderColor: 'inherit'}}>
        ???
      </div>
    </div>
  </div>
</div>