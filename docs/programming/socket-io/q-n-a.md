# Q & A

## Question 1: At least once, at most once, exactly once. What is SocketIO's default behavior? How can you you achieve the other two? Can you achieve the other two?

Answer: ...

## Question 2: What is emitWithAck? Can't I just use emit?

Answer: ...

## Question 3: How do you handle connection disconnects?

Answer: ...

## Question 4: How can you send a message between servers? Can you send a message between servers?

Answer: ...

## Question 5: Is Socket.IO still needed today?

That's a fair question, since WebSockets are supported almost everywhere now. That being said, we believe that, if you use plain WebSockets for your application, you will eventually need to implement most of the features that are already included (and battle-tested) in Socket.IO, like **reconnection**, **acknowledgements** or **broadcasting**.
