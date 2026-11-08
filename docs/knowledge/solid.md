# SOLID

<font size="4">An acronym for <strong>5 design principles</strong> in software engineering.</font>

## 1. Why do we need SOLID?

In software engineering, SOLID is actually five design principles created **to make object-oriented designs more understandable, flexible, and maintainable**.

## 2. S

The **single-Responsibility Principle** says that **Every class should have only one responsibility.**.

## 3. O

The **Open-Closed Principle** says that **software should be open for extension, but closed for modification**.

Basically means that **new behavior arrives as new code, and the code that already works stays untouched**.

The best example I have for this is validation. I have an object of type as keys, and then a validator function attached to that key. Adding a new type just means adding a new validator function on that object, attached to that type. I can remove or add as many types as I want to that object, introduce new behavior as new code, and not touch the already existing types and their validator functions.

## 4. L

## 5. I

## 6. D

The **Dependency Inversion principle** says to **depend on an abstraction, not a concrete class**.

## 7. Summary Table

|                             Letter                              | Meaning                                                                                                                                                                        |
| :-------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **<font size="6"><span style={{color: 'red'}}>S</span></font>** | The **Single Responsibility** principle says that _Every class should have only one responsibility_.                                                                           |
| **<font size="6"><span style={{color: 'red'}}>O</span></font>** | The **Open-Closed** principle says that _Software entities should be open for extension, but closed for modification_.                                                         |
| **<font size="6"><span style={{color: 'red'}}>L</span></font>** | The **Liskov Substitution** principle says that _Functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it_. |
| **<font size="6"><span style={{color: 'red'}}>I</span></font>** | The **Interface Segregation** principle says that _Clients should not be forced to depend upon interfaces that they do not use_".                                              |
| **<font size="6"><span style={{color: 'red'}}>D</span></font>** | The **Dependency Inversion** principle instructs you to _Depend upon abstractions, not concretions_.                                                                           |

Although the SOLID principles apply to any object-oriented design, they can also form a core philosophy for methodologies such as agile development or adaptive software development.
