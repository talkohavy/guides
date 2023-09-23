---
sidebar_label: 'Design Patterns'
sidebar_position: 2
sidebar_class_name: yellow
---

# Design Patterns

## 1. Strategy Pattern

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

*Why not inheritance?*  

The old solution back in the day, when Object Oriented was a huge hype, was with inheritance.  
What is inheritance in a nutshell?  
Consider a Duck class. The Duck class is a super class. The intention is that other classes should inherit from it. Duck has 3 methods on it:  
- quack
- display
- fly  

Let's now consider 2 sub-classes: WildDuck & CityDuck.  
In UML, we have 2 types of arrows:  
is-a === ---D  (this is an inheritance arrow)  
has-a === --->   (this is a composition arrow)  
In other words: "A wild duck IS a Duck". "A city duck IS a Duck".  
The sub-classes of Duck are in charge of implementing their own version of the "display" method. And thus, wild ducks can be displayed differently than city ducks.

** The problems with inheritance**  
_-- Downside 1: Not Resilient to Change_  
The main problem with it is that sub-classes must inherit ALL of the methods of the parent class, even when it's not logical.
We said that Duck has a "fly" method.
Now consider a new sub-class which is called RubberDuck.
Rubber ducks can't fly, but CityDuck & WildDuck can.
If we were to put the "fly" method on Duck, then RubberDuck would have to inherit it, and implement it. Even if it's not logical.
So yeah, we could think about this things ahead of time, and design properly, but consider a case where this "fly" method is some change that was offered by our product team later on.
This change would break our entire code structure of how we think about Duck.
So we are already seeing that inheritance isn't great with changes.
There IS an ugly solution for this is to force RubberDuck to also implement the "fly" method, and just have it do nothing.

_-- Downside 2: Code duplication_  
Horizontal inheritance is not possible. Consider a case where we add 2 new sub-classes (to the already existing sub-classes!): DuckA & DuckB  
Where they both have a "fly" method, which is exactly the same implementation! The "fly" over at Duck is really just the basic definition, so it can't be positioned there. We would need to duplicate the code twice on each of the two classes.  
The ugly, and extremely not feasible solution to this is, we can say that those two classes inherit from let's say a class called FlyingWithTypeA, but you can already see that it's starting to get realllyyyyy complicated.  
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

If we did this, if we were to hardcode the dependancy, it wouldn't be as flexible. It would put me back in a state where I need multiple classes to represent all of these different types of Ducks. Think about it, it is significantly less composable.  
We need to somehow inject the behavior.  

```javascript
// *** THIS IS GOOD ***

class Duck {
  IFlyBehavior fb;
  IQuackBehavior qb;
  IDisplayBehavior db;

  constrcutor({ fb, qb, db }){
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






:::tip My tip

Use this awesome feature option

:::

:::danger Take care

This action is dangerous

:::