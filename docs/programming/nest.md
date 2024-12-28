# Guide For Nest JS

## **1. Getting Started - Create Your Server**

### - Step 1: Create new project

Run the command:

```bash
nest new project-name
```

Followed by:

```bash
cd project-name
pnpm run start
```

You now have a running server on port 3000.

### - Step 2: Eslint

Nest is configured with the old eslint (v8), so you'll need to replace it with v9.

You'll need to uninstall all of these:

- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

and install these:

- `eslint` (latest)
- `@eslint/js`
- `eslint-plugin-perfectionist`
- `eslint-plugin-react-compiler`
- `globals`
- `typescript-eslint`

### - Step 3: tsconfig.json

Copy the tsconfig from `vs-vite-template` project, as it is more organized.

You'll need to manually change these however:

- `module`: set to `commonjs` instead of `ESNEXT`
- `noEmit`: set to `false` instead of `true`.
- `emitDecoratorMetadata`: set to `true` instead of `false`.
- `experimentalDecorators`: set to `true` instead of `false`.
- `outDir`: set to "./dist"
- `removeComments`: set to `true` instead of `false`.
- `moduleResolution`: set to `classic` instead of `bundler` (or simply unset it).
- `declaration`: set to `true` instead of `false`.

---

## **2. Nest Objects**

### - A. Providers (Services)

- Providers are a fundamental concept in Nest.
- Many things in Nest are considered as providers: services, repositories, factories, helpers, and so on.
- In 90% of cases, Providers in nest are actually **services**.
- **The main idea of a provider is that it can be injected as a dependency**.
- Тhe act of "wiring up" these objects is delegated to the Nest runtime system.
- Implementation-wise, Providers are really just a class with the **@Injectable()** decorator.  
  This means that this provider is something that can be injected into any class that depends on it.

Here is a Service Provider implementation example:

```ts
import { Injectable } from '@nestjs/common';
import { GetUsersDto, LoginDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  async login(body: LoginDto): Promise<string> {
    console.log('body is:', body);
    return 'you are logged in!';
  }

  async getUsers(query: GetUsersDto): Promise<string> {
    console.log('query is:', query);
    return 'get users';
  }
}
```

And Here is how it can be consumed in a Controller:  
(we'll learn about controller in the next section)

```ts
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ...
}
```

<br/>

---

### - B. Controllers

**- Description:**

- Controllers are responsible for handling incoming requests and returning responses to the client.
- A controller's purpose is to receive specific requests for the application (not handle them! just receive them).
- The routing mechanism controls which controller receives which requests. Frequently, each controller has more than one route, and different routes can perform different actions.
- In Nest, a basic controller is a class with a decorator of **@Controller**, which has the required metadata that enables Nest to create a routing map, and tie requests to the corresponding controllers.
- In Nest, often times a controller will have a Provider (a class with injectable) injected into it, which will carry the heavy-lifting of the task itself.

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  GetUsersDto,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
} from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: GetUsersDto): Promise<string> {
    const response = await this.usersService.getUsers(query);

    return response;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<string> {
    const response = await this.usersService.getUserById(id);

    return response;
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('updateUserDto is:', updateUserDto);
    return `This action updates a user of id ${id}`;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return `This action removes a user with an id of ${id}`;
  }
}
```

<br/>

---

### - C. Modules

#### 1. Overview

- A `module` is a class annotated with a **@Module()** decorator.
- The **@Module()** decorator takes a single object whose properties describe the module:

  - `providers`: the providers that will be instantiated by the Nest injector and that may be shared at least across this module.
  - `controllers`: the set of controllers defined in this module which have to be instantiated.
  - `imports`: the list of imported modules that export the providers which are required in this module.
  - `exports`: the subset of providers that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token (provide value).

- The **@Module()** decorator provides metadata that Nest makes use of to organize the application structure.

The module encapsulates providers by default. This means that it's impossible to inject providers that are neither directly part of the current module nor exported from the imported modules. Thus, you may consider the exported providers from a module as the module's public interface, or API.

In Nest, modules are singletons by default, and thus you can share the same instance of any provider between multiple modules effortlessly.

#### 2. Shared modules

Every module is automatically a shared module. Once created it can be reused by any module. Let's imagine that we want to share an instance of the CatsService between several other modules. In order to do that, we first need to export the CatsService provider by adding it to the module's exports array, as shown below:

```typescript

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

Now any module that imports the `CatsModule` has access to the `CatsService` and will share the same instance with all other modules that import it as well.

If we were to directly register the `CatsService` in every module that requires it, it would indeed work, but it would result in each module getting its own separate instance of the `CatsService`. This can lead to increased memory usage since multiple instances of the same service are created, and it could also cause unexpected behavior, such as state inconsistency if the service maintains any internal state.

By encapsulating the `CatsService` inside a module, such as the `CatsModule`, and exporting it, we ensure that the same instance of `CatsService` is reused across all modules that import `CatsModule`. This not only reduces memory consumption but also leads to more predictable behavior, as all modules share the same instance, making it easier to manage shared states or resources. This is one of the key benefits of modularity and dependency injection in frameworks like NestJS—allowing services to be efficiently shared throughout the application.

:::danger
`module` classes themselves cannot be injected as providers due to circular dependency. Avoid listing a `module` inside the `providers` array.
:::

#### 3. Global modules

If you have to import the same set of modules everywhere, it can get tedious. Unlike in Nest, Angular providers are registered in the global scope. Once defined, they're available everywhere. Nest, however, encapsulates providers inside the module scope. You aren't able to use a module's providers elsewhere without first importing the encapsulating module.

When you want to provide a set of providers which should be available everywhere out-of-the-box (e.g., helpers, database connections, etc.), make the module global with the **@Global()** decorator.

```ts

import { Global, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

The **@Global()** decorator makes the module global-scoped. Global modules should be registered only once, generally by the root or core module. In the above example, the `CatsService` provider will be ubiquitous, and modules that wish to inject the service will not need to import the `CatsModule` in their imports array.

:::warning
Making everything global is not a good design decision. Global modules are available to reduce the amount of necessary boilerplate. The imports array is generally the preferred way to make the module's API available to consumers.
:::

#### 4. Dynamic modules

The Nest module system includes a powerful feature called dynamic modules. This feature enables you to easily create customizable modules that can register and configure providers dynamically.

Following is an example of a dynamic module definition for a `DatabaseModule`:

```ts

import { DynamicModule, Module } from '@nestjs/common';
import { Connection } from './connection.provider';
import { createDatabaseProviders } from './database.providers';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}
```

:::info
The forRoot() method may return a dynamic module either synchronously or asynchronously (i.e., via a Promise).
:::

This module defines the `Connection` provider by default (in the **@Module()** decorator metadata), but additionally - depending on the `entities` and `options` objects passed into the `forRoot()` method - exposes a collection of providers, for example, repositories. Note that the properties returned by the dynamic module extend (rather than override) the base module metadata defined in the **@Module()** decorator. That's how both the statically declared `Connection` provider and the dynamically generated repository providers are exported from the module.

If you want to register a dynamic module in the global scope, set the `global` property to `true`.

```ts
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

The DatabaseModule can be imported and configured in the following manner:

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

<br/>

---

### - D. Filters

HttpException

### - D. Pipes

You can think of pipes in nest as kind of "middleware".

Pipes in nest are used for 2 main purposes: data transformation & data validation.

So it's either to transform your data, or to validate your data.

#### • Type 1: Data Transformation

The simplest way to explain data transformation, is the very common use case getting `:path` as a string, when it is in fact wanted as an integer.
Since `path` always comes as a string, we would need to convert it to a number every time. Using a pipe, you could have its value transformed to int. Nest has many of those built-in pipes. One of them is called `ParseIntPipe`, which you can use just for that case:

```js {6} showLineNumbers
/* eslint-disable */
@Controller()
export class GatewayController {
	constructor(private readonly httpService: HttpService) {}

    @Get(':id')
    getOnUser(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.service.getUser(id);
        } catch (err) {
            throw new NotFoundException();
        }
    }
}
```

You can, of course, create your own pipes. Nest allows you to do that very easily.

#### • Type 2: Data Validation

```ts title=create-user.dto.ts {1,4,8} showLineNumbers
import { MinLength } from 'class-validator';

export class CreateUserDto {
    @MinLength(3)
    name: string;

    // You can even provide your own customized error message.
    @IsEnum(['dog', 'cat'], { message: 'Use correct Pet!' })
    pet: 'dog' | 'cat';
}
```

```ts title=users.controller.ts {6} showLineNumbers
import { CreateUserDto } from './create-user-dto.ts';

// ...

@Post()
createUser(@Body(new ValidationPipe) createUserDto){
    return this.service.createUser(createUserDto);
}
```

If the validation fails, it automatically knows to throw a `BadRequestException` with a 400 status code.

### - E. Guards

A guard is a class annotated with the @Injectable() decorator, which implements the CanActivate interface.

Guards really only have a single responsibility, which is to protect the underlying routes based on some kind of logic.

For example, authentication & authorization.

We will use the CLI to generate a guard:

```bash
nest g guard isAuthenticated
```

This will create 2 files for you:

- src/isAuthenticated/isAuthenticated.guard.spec.ts
- src/isAuthenticated/isAuthenticated.guard.ts

A Guard is just another class with the @Injectable() decorator, kind of like a provider, only that it implements the `CanActivate` interface. The interface simply returns a true or false value. The core idea behind a Guard is that you can attach a guard either to a controller, or to individual methods on a controller.

When the value returned by that Guard is `true`, the requests moves on to the route.  
If the Guard returns `false` as its value, the process stops, and a 403 forbidden exception is returned by default.

The way you'd use a Guard on your controller is by using the @UseGuard() decorator.

Here's an example of using @UseGuard() on a controller, which will protect all of its routes:

```ts {4} showLineNumbers
import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';

@Controller('users')
@UseGuards(IsAuthenticatedGuard)
export class UserController{
    constructor(private readonly usersService: UserService) {}

    @Get()
    getUsers(){
        return this.usersService.getUsers();
    }

    @Get(:id)
    getOneUser(@Param() id: string){
        return this.usersService.getUsers(id);
    }
}
```

And here's an example of using @UseGuard() on a single route, to protect only that route:

```ts {8} showLineNumbers
import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';

@Controller('users')
export class UserController{
    constructor(private readonly usersService: UserService) {}

    @Get()
    @UseGuards(IsAuthenticatedGuard)
    getUsers(){
        return this.usersService.getUsers();
    }

    @Get(:id)
    getOneUser(@Param() id: string){
        return this.usersService.getUsers(id);
    }
}
```

- ExecutionContext

How to decide whether to return true or false is up to your business logic.  
Check out the code below. You can see that we're passing an `ExecutionContext` object, and what you'd usually want to do is parse the request out of that context.

```ts
/* eslint-disable */
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // validation flow process:
        const isAllowed = request.user.belts.includes('black');

		return isAllowed;
	}
}
```

## **3. Nest Swagger**

### - A. Installation

First you need to install a couple things:

```bash
yarn add @nestjs/swagger swagger-ui-express
```

### - B. Configure & Serve from main.ts

Next you need to go to `main.ts` file:

```ts title=main.ts {3,9-17} showLineNumbers
/* eslint-disable */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const config = new DocumentBuilder()
		.setTitle('API Gateway')
		.setDescription('The Gateway app for all services.')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('/', app, document);

	await app.listen(8000, () => console.log('app is running on 8000'));
}

bootstrap();
```

The '/' tells nest where to serve swagger-ui. In the above case, it will be served on `http://localhost:8000`.

### - C. Adjust TAGs

You can add TAGs to controllers, to have them grouped differently:

```ts {1} showLineNumbers
/* eslint-disable */
@ApiTags('infra-chat-service')
@Controller()
export class GatewayController {
  constructor(private readonly httpService: HttpService) {}

  @Get('is-alive')
  isAlive(): string {
    return 'OK';
  }
}
```

### - D. Param Validation

When using Dto objects, swagger-ui will be populated with the schemas already down at the bottom. To have routes make validations of those schemes, you can use something called an @ApiProperty decorator. Go to the Dto file inside the project and add the following:

```ts title=create-user.dto.ts {4,7} showLineNumbers
import { ApiProperty } from './@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
    age?: number;
}
```

The only "gotcha" above is that the @ApiProperty does not automatically catch the '?' which mark that a prop is optional. You need to specify that inside the @ApiProperty decorator.

### - E. Expected Response

You are able to represent the schema for the response using the @ApiCreatedResponse decorator.

```ts title=user.controller.ts {6,12} showLineNumbers
@Controller()
export class GatewayController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  createUser(@Body() body: CreateUserDto) {
    return this.service.createUser();
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true, description: 'Get multiple users' })
  getUsers(@Query(name) name?: string) {
    return this.service.getUsers();
  }

  @Get(':id')
  @ApiNotFoundResponse()
  getOnUser(@Param('id', ParseIntPipe) id: number) {
    const user = this.service.getUser(id);

    if (!user) throw new NotFoundException();

    return user;
  }
}
```

### - D. Expected Query

When fetching an array of objects, you often filter out using query params. This is the most common use-case for the @Query() decorator of nest. You can let swagger know of the structure of your query params using the @ApiQuery() decorator.

```ts {6} showLineNumbers
@Controller()
export class GatewayController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @ApiQuery({ name: 'name', required: false })
  getUsers(@Query(name) name?: string) {
    return this.service.getUsers();
  }
}
```

Note that once again, the '?' isn't telling swagger that this prop is optional, you need to specify that explicitly within the @ApiQuery decorator.

### Nest config

...to do ...

### How to handle CORS

...to do ...

### How to attach a Logger

...to do ...

## **4. Nest CLI**

### - A. **Install Nest CLI**

```bash
p add -g @nestjs/cli
```

<br/>

---

### - B. Command: resource

**- Command's form:**

```bash
nest g resource NAME
```

**- Description:**

Creates a folder named `name` with:

```bash
📂 name
 ┣ 📂 dto
 ┃ ┣ 📜 create-name.dto.ts
 ┃ ┗ 📜 update-name.dto.ts
 ┣ 📂 entities
 ┃ ┗ 📜name.entity.ts
 ┣ 📜 name.controller.spec.ts
 ┣ 📜 name.controller.ts
 ┣ 📜 name.module.ts
 ┣ 📜 name.service.spec.ts
 ┗ 📜 name.service.ts
```

<br/>

---

### - C. Command: service

**- Command's form:**

```bash
nest g service NAME
```

**- Description:**

Creates a folder named `name`, with 2 files:

```bash
📂 name
 ┣ 📜 name.service.spec.ts
 ┗ 📜 name.service.ts
```

<br/>

---

### - D. Command: module

**- Command's form:**

```bash
nest g module NAME
```

**- Description:**

<br/>

---
