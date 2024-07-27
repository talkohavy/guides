# Guide For Nest JS

## **1. Nest Objects**

### - A. Providers

Providers in nest are actually services.
Provider are really just a class, like everything else in nest, but they specifically have an @Injectable() decorator. That means that this provider is something that can be injected into any class that depends on it.

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

```ts
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { GetUsersDto, LoginDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: GetUsersDto): Promise<string> {
    const response = await this.usersService.getUsers(query);

    return response;
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<string> {
    const response = await this.usersService.login(body);

    return response;
  }
}
```

### - B. Services

```bash
nest g service isAuthenticated
```

### - C. Filters

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

## **2. Nest Swagger**

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
