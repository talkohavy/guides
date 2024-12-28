# Guide For Nest JS

## **1. Getting Started - Create an Advanced Server**

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
You can change the port number over at `main.ts`.

You might wanna add the lines:

```ts
const PORT = process.env.PORT ?? 8000;
await app.listen(PORT, () => console.log(`server running on port ${PORT}`));
```

### - Step 2: add dev script

In your package.json, add:

```json
{
  "dev": "nest start --watch",
}
```

### - Step 3: Eslint

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

### - Step 4: tsconfig.json

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

### - Step 5: use SWC

SWC (Speedy Web Compiler) is an extensible Rust-based platform that can be used for both compilation and bundling. Using SWC with Nest CLI is a great and simple way to significantly speed up your development process.

SWC is approximately x20 times faster than the default TypeScript compiler.

Install these packages:

```bash
p add -D @swc/cli @swc/core
```

And modify the `nest-cli.json`:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "builder": {
      "type": "swc",
      "options": {
        "outDir": "dist",
        "watch": false
      }
    },
    "deleteOutDir": true,
    "typeCheck": false // <--- in SWC, this defaults to false, and needs to be enabled manually.
  }
}
```

SWC does not perform any type checking itself (as opposed to the default TypeScript compiler), so to turn it on, you need to use the --type-check flag, or you can just set the `compilerOptions.typeCheck` property to true in your nest-cli.json.

#### SWC + Jest

To have support for jest in SWC, you first need to install:

```bash
p add -D jest @swc/core @swc/jest
```

Then update your `package.json`:

```json
{
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    // diff-add-start
    "transform": {
      "^.+\\.(t|j)s?$": [
        "@swc/jest"
      ]
    },
    "moduleNameMapper": {
      "^@src/(.*)": "<rootDir>/$1"
    },
    // diff-add-end
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

And add a `.swcrc` file at the root of your project, with the following contents:

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```

### - Step 6: Configuration

#### - A. Installation

To be able to read `.env` files, install the following:

```bash
p add @nestjs/config
```

The @nestjs/config package internally uses `dotenv`.
Since `@nestjs/config` relies on dotenv, it uses that package's rules for resolving conflicts in environment variable names. When a key exists both in the runtime environment as an environment variable (e.g., via OS shell exports like export DATABASE_USER=test) and in a .env file, the runtime environment variable takes precedence.

#### - B. Basic Usage

Once the installation process is complete, we can import the `ConfigModule` in the root `AppModule` and control its behavior using the **.forRoot()** static method:

```ts title=app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {
  // ...
}
```

What this does:

- It looks for a file named `.env` at the root of your project, reads it, and adds its contents to `process.env`.
- The **forRoot()** method registers the `ConfigService` provider, which provides a **get()** method for reading these parsed/merged configuration variables. For example:
  ```ts
  const nodeEnv = configService.get<EnvOptions>('nodeEnv');
  console.log(nodeEnv);
  ```

You can also specify a different path/name for the `.env` files like so:

```ts title=app.module.ts
ConfigModule.forRoot({
  envFilePath: '.env.development.local',
});
```

You can also specify multiple paths for .env files like so:

```ts title=app.module.ts
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
```

If a variable is found in multiple files, the first one takes precedence.

#### - C. Disable env variables loading

If you don't want to load the `.env` file, but instead would like to simply access environment variables from the runtime environment (as with OS shell exports like export DATABASE_USER=test), set the options object's `ignoreEnvFile` property to `true`.

#### - D. Advanced Usage - Custom configuration files

For more complex projects, you may utilize custom configuration files to return nested configuration objects.

A custom configuration file exports a factory function that returns a configuration object. The configuration object can be any arbitrarily nested plain JavaScript object. The `process.env` object will contain the fully resolved environment variable key/value pairs (with .env file and externally defined variables resolved and merged as described above). Since you control the returned configuration object, you can add any required logic to cast values to an appropriate type, set default values, etc. For example:

```ts title=src/config/getConfiguration.ts
export default function getConfiguration() {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
  };
}
```

You can even add a validation schema to your configuration:

```ts title=src/config/validationSchema.ts
import joi from 'joi';

export const envVariablesSchema = joi.object({
  PORT: joi.number().port(),
  IS_DEV: joi.string(),
});
```

then...

```ts title=app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // <--- defaults to '.env'
      isGlobal: true, // <--- defaults to false
      cache: true, // <--- defaults to false
      load: [getConfiguration],
      validationSchema: envVariablesSchema,
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
```

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from './config';
import { envVariablesSchema } from './config/validationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // <--- defaults to '.env'
      ignoreEnvFile: false, // <--- defaults to false.
      isGlobal: true, // <--- defaults to false
      cache: true, // <--- defaults to false
      load: [getConfiguration],
      validationSchema: envVariablesSchema,
    }),
  ],
})
export class AppModule {
  // ...
}
```

Then we can inject it using standard constructor injection:

```ts
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}
  // ...
}
```

#### - E. Enable CORS

On the main file of `main.ts`, add this line:

```ts title=main.ts
import { handleCors } from './common/utils/handleCors';

const nodeEnv = configService.get<EnvOptions>('nodeEnv');
app.enableCors({ origin: handleCors(nodeEnv), credentials: true });
```

And create a file `src/common/utils/handleCors.ts`, with the contents of:

```ts
import { UnauthorizedException } from '@nestjs/common';
import { EnvOptions } from '@src/config/types';

const ALLOWED_DOMAINS = ['http://localhost:3000', 'https://luckylove.co.il'];
const PROD_DOMAIN_REGEX = '.luckylove.co.il';

export function handleCors(nodeEnv: EnvOptions) {
  return (
    origin: string,
    callback: (err: Error | null, origin?: any) => void,
  ) => {
    const isAllowed =
      origin === undefined ||
      ALLOWED_DOMAINS.includes(origin) ||
      (nodeEnv !== EnvOptions.Prod && origin.endsWith(PROD_DOMAIN_REGEX));

    if (isAllowed) return void callback(null, true);

    callback(new UnauthorizedException('CORS not allowed'), false);
  };
}
```

#### - F. Enable Cookie Parser

To enable cookie parser, first install:

```bash
p add cookie-parser
p add -D @types/cookie-parser
```

Once the installation is complete, apply the cookie-parser middleware as global middleware (for example, in your main.ts file).

```ts
import cookieParser from 'cookie-parser';

// somewhere in your initialization file
app.use(cookieParser());
```

### - Step 7: Add a Custom Logger

#### - A. Introduction

Nest comes with a built-in text-based logger which is used during application bootstrapping and several other circumstances such as displaying caught exceptions. This functionality is provided via the `Logger` class in the `@nestjs/common` package.

You can also make use of the built-in logger, or create your own custom implementation, to log your own application-level events and messages.

#### - B. Basic Customization

To disable logging, set the `logger` property to `false` in the (optional) Nest application options object passed as the second argument to the `NestFactory.create()` method.

```ts

const app = await NestFactory.create(AppModule, {
  logger: false,
});
await app.listen(process.env.PORT ?? 3000);
```

To enable specific logging levels, set the `logger` property to an array of strings specifying the log levels to display, as follows:

```ts

const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn'],
});
await app.listen(process.env.PORT ?? 3000);
```

Values in the array can be any combination of `'log'`, `'fatal'`, `'error'`, `'warn'`, `'debug'`, and `'verbose'`.

:::info
To disable color in the default logger's messages, set the `NO_COLOR` environment variable to some non-empty string.
:::

#### - C. Custom Implementation

There are several way in which you can attach a logger to Nest. But the two most recommended ones are:

- Implementing the `LoggerService` interface
- Extending the `ConsoleLogger` class

Extending the `ConsoleLogger`:

```ts
import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    super.error(...arguments);
  }
}
```

Implementing the `LoggerService`:

```ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {}

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {}
}
```

#### - D. Logger as a module

For more advanced logging functionality, you'll want to take advantage of dependency injection. For example, you may want to inject a `ConfigService` into your logger to customize it, and in turn inject your custom logger into other controllers and/or providers. To enable dependency injection for your custom logger, create a class that implements `LoggerService` and register that class as a provider in some module.

```ts
import { Module } from '@nestjs/common';
import { MyLoggerService } from './myLogger.service';

@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService],
})
export class LoggerModule {}
```

With this construct, you are now providing your custom logger for use by any other module. Because your `MyLoggerService` class is part of a module, it can use dependency injection (for example, to inject a `ConfigService`).

#### - E. Logger on Nest load

There's one more technique needed to provide this custom logger for use by Nest for system logging (e.g., for bootstrapping and error handling).

Because application instantiation (`NestFactory.create()`) happens outside the context of any module, it doesn't participate in the normal Dependency Injection phase of initialization. So we must ensure that at least one application module imports the `LoggerModule` to trigger Nest to instantiate a singleton instance of our `MyLoggerService` class.

We can then instruct Nest to use the same singleton instance of `MyLoggerService` with the following construction:

```ts
const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
});
app.useLogger(app.get(MyLoggerService));
await app.listen(process.env.PORT ?? 3000);
```

Here we use the `get()` method on the `NestApplication` instance to retrieve the singleton instance of the `MyLoggerService` object. This technique is essentially a way to "inject" an instance of a logger for use by Nest. The `app.get()` call retrieves the singleton instance of `MyLoggerService`, and depends on that instance being first injected in another module, as described above.

When we supply a custom logger via `app.useLogger()`, it will actually be used by Nest internally. That means that our code remains implementation agnostic, while we can easily substitute the default logger for our custom one by calling `app.useLogger()`. That way calling to `this.logger.log()` from MyService would result in calls to method `log` from `MyLoggerService` instance.

You can also inject this `MyLoggerService` provider in your feature classes, thus ensuring consistent logging behavior across both Nest system logging and application logging.

:::info
In the example above, we set the `bufferLogs` to `true` to make sure all logs will be buffered until a custom logger is attached (`MyLoggerService` in this case) and the application initialization process either completes or fails. If the initialization process fails, Nest will fallback to the original `ConsoleLogger` to print out any reported error messages.
:::

#### - F. Logger with context

A good practice is to instantiate `Logger` class from `@nestjs/common` in each of our services. We can supply our **service name** as the `context` argument in the Logger constructor, like so:

```ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

In the default logger implementation, `context` is printed in the square brackets, like `NestFactory` in the example below:

```
[Nest] 19096   - 12/08/2019, 7:12:59 AM   [NestFactory] Starting Nest application...
```

Fortunately, Nest supplies the `scope` option as configuration metadata for the `ConsoleLogger` class, specifying a **transient** scope, to ensure that we'll have a unique instance of the `MyLoggerService` in each feature module. In this example, we do not extend the individual `ConsoleLogger` methods (like `log()`, `warn()`, etc.), though you may choose to do so.

```ts
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  customLog() {
    this.log('Please feed the cat!');
  }
}
```

Next, import the `LoggerModule` into your feature module. Since we extended default `Logger` we have the convenience of using `setContext` method. So we can start using the context-aware custom logger, like this:

```ts

import { Injectable } from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  constructor(private myLogger: MyLogger) {
    // Due to transient scope, CatsService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext('CatsService');
  }

  findAll(): Cat[] {
    // You can call all the default methods
    this.myLogger.warn('About to return cats!');
    // And your custom methods
    this.myLogger.customLog();
    return this.cats;
  }
}
```

Finally, instruct Nest to create a new instance of your logger:

```ts
const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
});
// diff-remove-start
app.useLogger(app.get(MyLoggerService));
// diff-remove-end
// diff-add-start
app.useLogger(new MyLogger());
// diff-add-end
await app.listen(process.env.PORT ?? 3000);
```

### - Step 8: add handlers for UncaughtException & UnhandledRejection

At the main file of `main.ts`, under `await app.listen`, add these lines:

```ts
process.on('uncaughtException', () => {
  console.error('AVOID SERVER CRASH - uncaughtException');
});

process.on('unhandledRejection', () => {
  console.error('AVOID SERVER CRASH - unhandledRejection');
});
```

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
