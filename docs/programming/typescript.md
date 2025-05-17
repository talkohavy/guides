# Typescript

## 1. Enum as const

How to create an enum without using Enum keyword:

```ts
export const ROUTES = {
  Home: '/',
  Admin: '/admin',
  Users: '/users',
} as const;

type TypeOfRoutes = typeof ROUTES;
export type KeysOfRoutes = keyof TypeOfRoutes; // <--- Use when need the key on the enum that's used to retrieve the value.
export type RoutesEnumType = TypeOfRoutes[KeysOfRoutes]; // <--- Use when in need of enum value

```

The `as const` makes objects `readonly`. It is telling the IDE that this object cannot be changed. Meaning that trying to modify a key's value later would result in a typescript error. You'll might notice that we could have used `Object.freeze()`. It does the same thing, and it works on the type level too. There are 2 main differences though. One is that it also prevents modifications at runtime as well, and two, that it only prevents modifications of values on the top-level keys.

Next up, we have `TypeOfRouts`. Since `routes` is a variable inited with the `const` keyword, it's in the javascript world. But we need its type, so we need to move it to the typescript world. For that we use the typeof `keyword`.

```ts

```

---

## 2. Prettify

You can create a type prettifier yourself:

```ts
// Define Prettify: a utility type that makes the type more readable
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// ---------------------

// Example usage:

type ComplexType = {
  name: string;
  age: number;
  location: string;
} & Omit<
  {
    c: string;
    hobbies: string[];
    isActive: boolean;
  },
  'c'
> &
  Record<'metadata', string[]>;

export type PrettyComplexType = Prettify<ComplexType>;
```

---

## 3. Extract, Exclude, Pick & Omit

Extract and exclude are for Unions, Pick & Omit are for objects.

```ts
type User = {
  id: number;
  name: string;
  age: number;
};

export type UserWithoutId = Omit<User, 'id'>;
export type UserWithId = Pick<User, 'id'>;

// -----------------------------------

type TypeA = {
  type: 'aaa';
  body: {
    id: number;
    name: string;
  };
};

type TypeB = {
  type: 'bbb';
  body: {
    scriptId: number;
  };
};

type TypeC = {
  type: 'ccc';
  body: {
    location: string;
  };
};

type AllTypes = TypeA | TypeB | TypeC;

export type TwoTypes = Exclude<AllTypes, TypeA | TypeB>;
export type OneType = Exclude<AllTypes, TypeA | TypeB | TypeC>;
```

---

## 4. Key Optional V.S. Value Optional

Try switching the `traceId` of `doThing` & `doAnotherThing`.

```ts
/**
 * Key Optional V.S. Value Optional
 */

type MainProps = {
  traceId?: string;
};
function main(props: MainProps) {
  const { traceId } = props;

  doThing({ traceId });
  doAnotherThing({ traceId });
}

type DoThingProps = {
  traceId?: string;
  // traceId: string | undefined;
};
function doThing(props: DoThingProps) {
  const { traceId } = props;

  console.log('traceId is:', traceId);
}

type DoAnotherThingProps = {
  traceId?: string;
  // traceId: string | undefined;
};
function doAnotherThing(props: DoAnotherThingProps) {
  const { traceId } = props;

  console.log('traceId is:', traceId);
}

main({ traceId: '12345' });
```

---

## 5. Mapped Types

```ts
type User = {
  id: number;
  name: string;
  age: number;
};

// --------------------

export type TransformedUser1 = {
  [K in keyof User]: K;
};

export type TransformedUser2 = {
  [K in keyof User as K]: User[K];
};

export type TransformedUser3 = {
  readonly [K in keyof User]?: User[K];
};

export type TransformedUser4 = {
  readonly [K in keyof User as `get${Capitalize<K>}`]: () => User[K];
};
```

---

## 6. Immediately Indexed Mapped Types

```ts
import { Prettify } from './prettify';

// The example type:
type Actions = {
  login: {
    username: string;
    password: string;
  };
  logout: {
    reason: string;
  };
  updateProfile: {
    userId: number;
    profileData: {
      name: string;
      email: string;
      age: number;
    };
  };
};

// ---------------------------------

export type ActionsAsUnion1 = {
  [K in keyof Actions]: any;
};

export type ActionsAsUnion2 = {
  [K in keyof Actions]: {
    type: K;
  };
};

export type ActionsAsUnion3 = {
  [K in keyof Actions]: {
    type: K;
  } & Actions[K];
};

export type ActionsAsUnion4 = {
  [K in keyof Actions]: Prettify<
    {
      type: K;
    } & Actions[K]
  >;
};

// And finally, here we're using the immediately indexed mapped types (IIMP)
export type ActionsAsUnion5 = {
  [K in keyof Actions]: Prettify<
    {
      type: K;
    } & Actions[K]
  >;
}[keyof Actions];

// This is ALMOST the same as doing:
export type ActionsAsUnion6 = Actions['login' | 'logout' | 'updateProfile'];
// or just:
export type ActionsAsUnion7 = Actions[keyof Actions];
```
