"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[2317],{7970:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"programming/nest","title":"Guide For Nest JS","description":"1. Nest Objects","source":"@site/docs/programming/nest.md","sourceDirName":"programming","slug":"/programming/nest","permalink":"/guides/he/docs/programming/nest","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/programming/nest.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- MongoDB","permalink":"/guides/he/docs/programming/mongodb"},"next":{"title":"- Node","permalink":"/guides/he/docs/programming/node"}}');var r=s(6070),o=s(7010);const i={},a="Guide For Nest JS",l={},d=[{value:"<strong>1. Nest Objects</strong>",id:"1-nest-objects",level:2},{value:"- A. Providers (Services)",id:"--a-providers-services",level:3},{value:"- B. Controllers",id:"--b-controllers",level:3},{value:"- C. Modules",id:"--c-modules",level:3},{value:"1. Overview",id:"1-overview",level:4},{value:"2. Shared modules",id:"2-shared-modules",level:4},{value:"3. Global modules",id:"3-global-modules",level:4},{value:"4. Dynamic modules",id:"4-dynamic-modules",level:4},{value:"- D. Filters",id:"--d-filters",level:3},{value:"- D. Pipes",id:"--d-pipes",level:3},{value:"\u2022 Type 1: Data Transformation",id:"-type-1-data-transformation",level:4},{value:"\u2022 Type 2: Data Validation",id:"-type-2-data-validation",level:4},{value:"- E. Guards",id:"--e-guards",level:3},{value:"<strong>2. Nest Swagger</strong>",id:"2-nest-swagger",level:2},{value:"- A. Installation",id:"--a-installation",level:3},{value:"- B. Configure &amp; Serve from main.ts",id:"--b-configure--serve-from-maints",level:3},{value:"- C. Adjust TAGs",id:"--c-adjust-tags",level:3},{value:"- D. Param Validation",id:"--d-param-validation",level:3},{value:"- E. Expected Response",id:"--e-expected-response",level:3},{value:"- D. Expected Query",id:"--d-expected-query",level:3},{value:"Nest config",id:"nest-config",level:3},{value:"How to handle CORS",id:"how-to-handle-cors",level:3},{value:"How to attach a Logger",id:"how-to-attach-a-logger",level:3},{value:"<strong>3. Nest CLI</strong>",id:"3-nest-cli",level:2},{value:"- A. <strong>Install Nest CLI</strong>",id:"--a-install-nest-cli",level:3},{value:"- B. Command: resource",id:"--b-command-resource",level:3},{value:"- C. Command: service",id:"--c-command-service",level:3},{value:"- D. Command: module",id:"--d-command-module",level:3}];function c(e){const n={admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"guide-for-nest-js",children:"Guide For Nest JS"})}),"\n",(0,r.jsx)(n.h2,{id:"1-nest-objects",children:(0,r.jsx)(n.strong,{children:"1. Nest Objects"})}),"\n",(0,r.jsx)(n.h3,{id:"--a-providers-services",children:"- A. Providers (Services)"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Providers are a fundamental concept in Nest."}),"\n",(0,r.jsx)(n.li,{children:"Many things in Nest are considered as providers: services, repositories, factories, helpers, and so on."}),"\n",(0,r.jsxs)(n.li,{children:["In 90% of cases, Providers in nest are actually ",(0,r.jsx)(n.strong,{children:"services"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"The main idea of a provider is that it can be injected as a dependency"}),"."]}),"\n",(0,r.jsx)(n.li,{children:'\u0422he act of "wiring up" these objects is delegated to the Nest runtime system.'}),"\n",(0,r.jsxs)(n.li,{children:["Implementation-wise, Providers are really just a class with the ",(0,r.jsx)(n.strong,{children:"@Injectable()"})," decorator.",(0,r.jsx)(n.br,{}),"\n","This means that this provider is something that can be injected into any class that depends on it."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Here is a Service Provider implementation example:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { Injectable } from '@nestjs/common';\nimport { GetUsersDto, LoginDto } from './dto/users.dto';\n\n@Injectable()\nexport class UsersService {\n  async login(body: LoginDto): Promise<string> {\n    console.log('body is:', body);\n    return 'you are logged in!';\n  }\n\n  async getUsers(query: GetUsersDto): Promise<string> {\n    console.log('query is:', query);\n    return 'get users';\n  }\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["And Here is how it can be consumed in a Controller:",(0,r.jsx)(n.br,{}),"\n","(we'll learn about controller in the next section)"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { Controller } from '@nestjs/common';\nimport { UsersService } from './users.service';\n\n@Controller('users')\nexport class UsersController {\n  constructor(private readonly usersService: UsersService) {}\n\n  // ...\n}\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--b-controllers",children:"- B. Controllers"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Controllers are responsible for handling incoming requests and returning responses to the client."}),"\n",(0,r.jsx)(n.li,{children:"A controller's purpose is to receive specific requests for the application (not handle them! just receive them)."}),"\n",(0,r.jsx)(n.li,{children:"The routing mechanism controls which controller receives which requests. Frequently, each controller has more than one route, and different routes can perform different actions."}),"\n",(0,r.jsxs)(n.li,{children:["In Nest, a basic controller is a class with a decorator of ",(0,r.jsx)(n.strong,{children:"@Controller"}),", which has the required metadata that enables Nest to create a routing map, and tie requests to the corresponding controllers."]}),"\n",(0,r.jsx)(n.li,{children:"In Nest, often times a controller will have a Provider (a class with injectable) injected into it, which will carry the heavy-lifting of the task itself."}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"import {\n  Body,\n  Controller,\n  Delete,\n  Get,\n  HttpException,\n  HttpStatus,\n  Param,\n  Post,\n  Put,\n  Query,\n} from '@nestjs/common';\nimport {\n  GetUsersDto,\n  LoginDto,\n  RegisterDto,\n  UpdateUserDto,\n} from './dto/users.dto';\nimport { UsersService } from './users.service';\n\n@Controller('users')\nexport class UsersController {\n  constructor(private readonly usersService: UsersService) {}\n\n  @Get()\n  async getUsers(@Query() query: GetUsersDto): Promise<string> {\n    const response = await this.usersService.getUsers(query);\n\n    return response;\n  }\n\n  @Get(':id')\n  async getUserById(@Param('id') id: string): Promise<string> {\n    const response = await this.usersService.getUserById(id);\n\n    return response;\n  }\n\n  @Put(':id')\n  async updateUser(\n    @Param('id') id: string,\n    @Body() updateUserDto: UpdateUserDto,\n  ) {\n    console.log('updateUserDto is:', updateUserDto);\n    return `This action updates a user of id ${id}`;\n  }\n\n  @Delete(':id')\n  async deleteUser(@Param('id') id: string) {\n    return `This action removes a user with an id of ${id}`;\n  }\n}\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--c-modules",children:"- C. Modules"}),"\n",(0,r.jsx)(n.h4,{id:"1-overview",children:"1. Overview"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["A ",(0,r.jsx)(n.code,{children:"module"})," is a class annotated with a ",(0,r.jsx)(n.strong,{children:"@Module()"})," decorator."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.strong,{children:"@Module()"})," decorator takes a single object whose properties describe the module:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"providers"}),": the providers that will be instantiated by the Nest injector and that may be shared at least across this module."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"controllers"}),": the set of controllers defined in this module which have to be instantiated."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"imports"}),": the list of imported modules that export the providers which are required in this module."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"exports"}),": the subset of providers that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token (provide value)."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.strong,{children:"@Module()"})," decorator provides metadata that Nest makes use of to organize the application structure."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The module encapsulates providers by default. This means that it's impossible to inject providers that are neither directly part of the current module nor exported from the imported modules. Thus, you may consider the exported providers from a module as the module's public interface, or API."}),"\n",(0,r.jsx)(n.p,{children:"In Nest, modules are singletons by default, and thus you can share the same instance of any provider between multiple modules effortlessly."}),"\n",(0,r.jsx)(n.h4,{id:"2-shared-modules",children:"2. Shared modules"}),"\n",(0,r.jsx)(n.p,{children:"Every module is automatically a shared module. Once created it can be reused by any module. Let's imagine that we want to share an instance of the CatsService between several other modules. In order to do that, we first need to export the CatsService provider by adding it to the module's exports array, as shown below:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"\nimport { Module } from '@nestjs/common';\nimport { CatsController } from './cats.controller';\nimport { CatsService } from './cats.service';\n\n@Module({\n  controllers: [CatsController],\n  providers: [CatsService],\n  exports: [CatsService]\n})\nexport class CatsModule {}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Now any module that imports the ",(0,r.jsx)(n.code,{children:"CatsModule"})," has access to the ",(0,r.jsx)(n.code,{children:"CatsService"})," and will share the same instance with all other modules that import it as well."]}),"\n",(0,r.jsxs)(n.p,{children:["If we were to directly register the ",(0,r.jsx)(n.code,{children:"CatsService"})," in every module that requires it, it would indeed work, but it would result in each module getting its own separate instance of the ",(0,r.jsx)(n.code,{children:"CatsService"}),". This can lead to increased memory usage since multiple instances of the same service are created, and it could also cause unexpected behavior, such as state inconsistency if the service maintains any internal state."]}),"\n",(0,r.jsxs)(n.p,{children:["By encapsulating the ",(0,r.jsx)(n.code,{children:"CatsService"})," inside a module, such as the ",(0,r.jsx)(n.code,{children:"CatsModule"}),", and exporting it, we ensure that the same instance of ",(0,r.jsx)(n.code,{children:"CatsService"})," is reused across all modules that import ",(0,r.jsx)(n.code,{children:"CatsModule"}),". This not only reduces memory consumption but also leads to more predictable behavior, as all modules share the same instance, making it easier to manage shared states or resources. This is one of the key benefits of modularity and dependency injection in frameworks like NestJS\u2014allowing services to be efficiently shared throughout the application."]}),"\n",(0,r.jsx)(n.admonition,{type:"danger",children:(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"module"})," classes themselves cannot be injected as providers due to circular dependency. Avoid listing a ",(0,r.jsx)(n.code,{children:"module"})," inside the ",(0,r.jsx)(n.code,{children:"providers"})," array."]})}),"\n",(0,r.jsx)(n.h4,{id:"3-global-modules",children:"3. Global modules"}),"\n",(0,r.jsx)(n.p,{children:"If you have to import the same set of modules everywhere, it can get tedious. Unlike in Nest, Angular providers are registered in the global scope. Once defined, they're available everywhere. Nest, however, encapsulates providers inside the module scope. You aren't able to use a module's providers elsewhere without first importing the encapsulating module."}),"\n",(0,r.jsxs)(n.p,{children:["When you want to provide a set of providers which should be available everywhere out-of-the-box (e.g., helpers, database connections, etc.), make the module global with the ",(0,r.jsx)(n.strong,{children:"@Global()"})," decorator."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"\nimport { Global, Module } from '@nestjs/common';\nimport { CatsController } from './cats.controller';\nimport { CatsService } from './cats.service';\n\n@Global()\n@Module({\n  controllers: [CatsController],\n  providers: [CatsService],\n  exports: [CatsService],\n})\nexport class CatsModule {}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.strong,{children:"@Global()"})," decorator makes the module global-scoped. Global modules should be registered only once, generally by the root or core module. In the above example, the ",(0,r.jsx)(n.code,{children:"CatsService"})," provider will be ubiquitous, and modules that wish to inject the service will not need to import the ",(0,r.jsx)(n.code,{children:"CatsModule"})," in their imports array."]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsx)(n.p,{children:"Making everything global is not a good design decision. Global modules are available to reduce the amount of necessary boilerplate. The imports array is generally the preferred way to make the module's API available to consumers."})}),"\n",(0,r.jsx)(n.h4,{id:"4-dynamic-modules",children:"4. Dynamic modules"}),"\n",(0,r.jsx)(n.p,{children:"The Nest module system includes a powerful feature called dynamic modules. This feature enables you to easily create customizable modules that can register and configure providers dynamically."}),"\n",(0,r.jsxs)(n.p,{children:["Following is an example of a dynamic module definition for a ",(0,r.jsx)(n.code,{children:"DatabaseModule"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"\nimport { DynamicModule, Module } from '@nestjs/common';\nimport { Connection } from './connection.provider';\nimport { createDatabaseProviders } from './database.providers';\n\n@Module({\n  providers: [Connection],\n  exports: [Connection],\n})\nexport class DatabaseModule {\n  static forRoot(entities = [], options?): DynamicModule {\n    const providers = createDatabaseProviders(options, entities);\n    return {\n      module: DatabaseModule,\n      providers,\n      exports: providers,\n    };\n  }\n}\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"The forRoot() method may return a dynamic module either synchronously or asynchronously (i.e., via a Promise)."})}),"\n",(0,r.jsxs)(n.p,{children:["This module defines the ",(0,r.jsx)(n.code,{children:"Connection"})," provider by default (in the ",(0,r.jsx)(n.strong,{children:"@Module()"})," decorator metadata), but additionally - depending on the ",(0,r.jsx)(n.code,{children:"entities"})," and ",(0,r.jsx)(n.code,{children:"options"})," objects passed into the ",(0,r.jsx)(n.code,{children:"forRoot()"})," method - exposes a collection of providers, for example, repositories. Note that the properties returned by the dynamic module extend (rather than override) the base module metadata defined in the ",(0,r.jsx)(n.strong,{children:"@Module()"})," decorator. That's how both the statically declared ",(0,r.jsx)(n.code,{children:"Connection"})," provider and the dynamically generated repository providers are exported from the module."]}),"\n",(0,r.jsxs)(n.p,{children:["If you want to register a dynamic module in the global scope, set the ",(0,r.jsx)(n.code,{children:"global"})," property to ",(0,r.jsx)(n.code,{children:"true"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"{\n  global: true,\n  module: DatabaseModule,\n  providers: providers,\n  exports: providers,\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"The DatabaseModule can be imported and configured in the following manner:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { Module } from '@nestjs/common';\nimport { DatabaseModule } from './database/database.module';\nimport { User } from './users/entities/user.entity';\n\n@Module({\n  imports: [DatabaseModule.forRoot([User])],\n})\nexport class AppModule {}\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--d-filters",children:"- D. Filters"}),"\n",(0,r.jsx)(n.p,{children:"HttpException"}),"\n",(0,r.jsx)(n.h3,{id:"--d-pipes",children:"- D. Pipes"}),"\n",(0,r.jsx)(n.p,{children:'You can think of pipes in nest as kind of "middleware".'}),"\n",(0,r.jsx)(n.p,{children:"Pipes in nest are used for 2 main purposes: data transformation & data validation."}),"\n",(0,r.jsx)(n.p,{children:"So it's either to transform your data, or to validate your data."}),"\n",(0,r.jsx)(n.h4,{id:"-type-1-data-transformation",children:"\u2022 Type 1: Data Transformation"}),"\n",(0,r.jsxs)(n.p,{children:["The simplest way to explain data transformation, is the very common use case getting ",(0,r.jsx)(n.code,{children:":path"})," as a string, when it is in fact wanted as an integer.\nSince ",(0,r.jsx)(n.code,{children:"path"})," always comes as a string, we would need to convert it to a number every time. Using a pipe, you could have its value transformed to int. Nest has many of those built-in pipes. One of them is called ",(0,r.jsx)(n.code,{children:"ParseIntPipe"}),", which you can use just for that case:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",metastring:"{6} showLineNumbers",children:"/* eslint-disable */\n@Controller()\nexport class GatewayController {\n\tconstructor(private readonly httpService: HttpService) {}\n\n    @Get(':id')\n    getOnUser(@Param('id', ParseIntPipe) id: number) {\n        try {\n            return this.service.getUser(id);\n        } catch (err) {\n            throw new NotFoundException();\n        }\n    }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"You can, of course, create your own pipes. Nest allows you to do that very easily."}),"\n",(0,r.jsx)(n.h4,{id:"-type-2-data-validation",children:"\u2022 Type 2: Data Validation"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"title=create-user.dto.ts {1,4,8} showLineNumbers",children:"import { MinLength } from 'class-validator';\n\nexport class CreateUserDto {\n    @MinLength(3)\n    name: string;\n\n    // You can even provide your own customized error message.\n    @IsEnum(['dog', 'cat'], { message: 'Use correct Pet!' })\n    pet: 'dog' | 'cat';\n}\n"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"title=users.controller.ts {6} showLineNumbers",children:"import { CreateUserDto } from './create-user-dto.ts';\n\n// ...\n\n@Post()\ncreateUser(@Body(new ValidationPipe) createUserDto){\n    return this.service.createUser(createUserDto);\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If the validation fails, it automatically knows to throw a ",(0,r.jsx)(n.code,{children:"BadRequestException"})," with a 400 status code."]}),"\n",(0,r.jsx)(n.h3,{id:"--e-guards",children:"- E. Guards"}),"\n",(0,r.jsx)(n.p,{children:"A guard is a class annotated with the @Injectable() decorator, which implements the CanActivate interface."}),"\n",(0,r.jsx)(n.p,{children:"Guards really only have a single responsibility, which is to protect the underlying routes based on some kind of logic."}),"\n",(0,r.jsx)(n.p,{children:"For example, authentication & authorization."}),"\n",(0,r.jsx)(n.p,{children:"We will use the CLI to generate a guard:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"nest g guard isAuthenticated\n"})}),"\n",(0,r.jsx)(n.p,{children:"This will create 2 files for you:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"src/isAuthenticated/isAuthenticated.guard.spec.ts"}),"\n",(0,r.jsx)(n.li,{children:"src/isAuthenticated/isAuthenticated.guard.ts"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["A Guard is just another class with the @Injectable() decorator, kind of like a provider, only that it implements the ",(0,r.jsx)(n.code,{children:"CanActivate"})," interface. The interface simply returns a true or false value. The core idea behind a Guard is that you can attach a guard either to a controller, or to individual methods on a controller."]}),"\n",(0,r.jsxs)(n.p,{children:["When the value returned by that Guard is ",(0,r.jsx)(n.code,{children:"true"}),", the requests moves on to the route.",(0,r.jsx)(n.br,{}),"\n","If the Guard returns ",(0,r.jsx)(n.code,{children:"false"})," as its value, the process stops, and a 403 forbidden exception is returned by default."]}),"\n",(0,r.jsx)(n.p,{children:"The way you'd use a Guard on your controller is by using the @UseGuard() decorator."}),"\n",(0,r.jsx)(n.p,{children:"Here's an example of using @UseGuard() on a controller, which will protect all of its routes:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"{4} showLineNumbers",children:"import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';\n\n@Controller('users')\n@UseGuards(IsAuthenticatedGuard)\nexport class UserController{\n    constructor(private readonly usersService: UserService) {}\n\n    @Get()\n    getUsers(){\n        return this.usersService.getUsers();\n    }\n\n    @Get(:id)\n    getOneUser(@Param() id: string){\n        return this.usersService.getUsers(id);\n    }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"And here's an example of using @UseGuard() on a single route, to protect only that route:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"{8} showLineNumbers",children:"import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';\n\n@Controller('users')\nexport class UserController{\n    constructor(private readonly usersService: UserService) {}\n\n    @Get()\n    @UseGuards(IsAuthenticatedGuard)\n    getUsers(){\n        return this.usersService.getUsers();\n    }\n\n    @Get(:id)\n    getOneUser(@Param() id: string){\n        return this.usersService.getUsers(id);\n    }\n}\n"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"ExecutionContext"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["How to decide whether to return true or false is up to your business logic.",(0,r.jsx)(n.br,{}),"\n","Check out the code below. You can see that we're passing an ",(0,r.jsx)(n.code,{children:"ExecutionContext"})," object, and what you'd usually want to do is parse the request out of that context."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"/* eslint-disable */\nimport { Observable } from 'rxjs';\nimport { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class IsAuthenticatedGuard implements CanActivate {\n\tcanActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {\n        const request = context.switchToHttp().getRequest();\n\n        // validation flow process:\n        const isAllowed = request.user.belts.includes('black');\n\n\t\treturn isAllowed;\n\t}\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"2-nest-swagger",children:(0,r.jsx)(n.strong,{children:"2. Nest Swagger"})}),"\n",(0,r.jsx)(n.h3,{id:"--a-installation",children:"- A. Installation"}),"\n",(0,r.jsx)(n.p,{children:"First you need to install a couple things:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"yarn add @nestjs/swagger swagger-ui-express\n"})}),"\n",(0,r.jsx)(n.h3,{id:"--b-configure--serve-from-maints",children:"- B. Configure & Serve from main.ts"}),"\n",(0,r.jsxs)(n.p,{children:["Next you need to go to ",(0,r.jsx)(n.code,{children:"main.ts"})," file:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"title=main.ts {3,9-17} showLineNumbers",children:"/* eslint-disable */\nimport { NestFactory } from '@nestjs/core';\nimport { NestExpressApplication } from '@nestjs/platform-express';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { AppModule } from './modules/app.module';\n\nasync function bootstrap() {\n    const app = await NestFactory.create<NestExpressApplication>(AppModule);\n\n\tconst config = new DocumentBuilder()\n\t\t.setTitle('API Gateway')\n\t\t.setDescription('The Gateway app for all services.')\n\t\t.setVersion('1.0.0')\n\t\t.build();\n\n\tconst document = SwaggerModule.createDocument(app, config);\n\n\tSwaggerModule.setup('/', app, document);\n\n\tawait app.listen(8000, () => console.log('app is running on 8000'));\n}\n\nbootstrap();\n"})}),"\n",(0,r.jsxs)(n.p,{children:["The '/' tells nest where to serve swagger-ui. In the above case, it will be served on ",(0,r.jsx)(n.code,{children:"http://localhost:8000"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"--c-adjust-tags",children:"- C. Adjust TAGs"}),"\n",(0,r.jsx)(n.p,{children:"You can add TAGs to controllers, to have them grouped differently:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"{1} showLineNumbers",children:"/* eslint-disable */\n@ApiTags('infra-chat-service')\n@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Get('is-alive')\n  isAlive(): string {\n    return 'OK';\n  }\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"--d-param-validation",children:"- D. Param Validation"}),"\n",(0,r.jsx)(n.p,{children:"When using Dto objects, swagger-ui will be populated with the schemas already down at the bottom. To have routes make validations of those schemes, you can use something called an @ApiProperty decorator. Go to the Dto file inside the project and add the following:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"title=create-user.dto.ts {4,7} showLineNumbers",children:"import { ApiProperty } from './@nestjs/swagger';\n\nexport class CreateUserDto {\n    @ApiProperty()\n    name: string;\n\n    @ApiProperty({ required: false })\n    age?: number;\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"The only \"gotcha\" above is that the @ApiProperty does not automatically catch the '?' which mark that a prop is optional. You need to specify that inside the @ApiProperty decorator."}),"\n",(0,r.jsx)(n.h3,{id:"--e-expected-response",children:"- E. Expected Response"}),"\n",(0,r.jsx)(n.p,{children:"You are able to represent the schema for the response using the @ApiCreatedResponse decorator."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"title=user.controller.ts {6,12} showLineNumbers",children:"@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Post()\n  @ApiCreatedResponse({ type: User })\n  createUser(@Body() body: CreateUserDto) {\n    return this.service.createUser();\n  }\n\n  @Get()\n  @ApiOkResponse({ type: User, isArray: true, description: 'Get multiple users' })\n  getUsers(@Query(name) name?: string) {\n    return this.service.getUsers();\n  }\n\n  @Get(':id')\n  @ApiNotFoundResponse()\n  getOnUser(@Param('id', ParseIntPipe) id: number) {\n    const user = this.service.getUser(id);\n\n    if (!user) throw new NotFoundException();\n\n    return user;\n  }\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"--d-expected-query",children:"- D. Expected Query"}),"\n",(0,r.jsx)(n.p,{children:"When fetching an array of objects, you often filter out using query params. This is the most common use-case for the @Query() decorator of nest. You can let swagger know of the structure of your query params using the @ApiQuery() decorator."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"{6} showLineNumbers",children:"@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Get()\n  @ApiQuery({ name: 'name', required: false })\n  getUsers(@Query(name) name?: string) {\n    return this.service.getUsers();\n  }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"Note that once again, the '?' isn't telling swagger that this prop is optional, you need to specify that explicitly within the @ApiQuery decorator."}),"\n",(0,r.jsx)(n.h3,{id:"nest-config",children:"Nest config"}),"\n",(0,r.jsx)(n.p,{children:"...to do ..."}),"\n",(0,r.jsx)(n.h3,{id:"how-to-handle-cors",children:"How to handle CORS"}),"\n",(0,r.jsx)(n.p,{children:"...to do ..."}),"\n",(0,r.jsx)(n.h3,{id:"how-to-attach-a-logger",children:"How to attach a Logger"}),"\n",(0,r.jsx)(n.p,{children:"...to do ..."}),"\n",(0,r.jsx)(n.h2,{id:"3-nest-cli",children:(0,r.jsx)(n.strong,{children:"3. Nest CLI"})}),"\n",(0,r.jsxs)(n.h3,{id:"--a-install-nest-cli",children:["- A. ",(0,r.jsx)(n.strong,{children:"Install Nest CLI"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"p add -g @nestjs/cli\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--b-command-resource",children:"- B. Command: resource"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"nest g resource NAME\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.p,{children:["Creates a folder named ",(0,r.jsx)(n.code,{children:"name"})," with:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"\ud83d\udcc2 name\n \u2523 \ud83d\udcc2 dto\n \u2503 \u2523 \ud83d\udcdc create-name.dto.ts\n \u2503 \u2517 \ud83d\udcdc update-name.dto.ts\n \u2523 \ud83d\udcc2 entities\n \u2503 \u2517 \ud83d\udcdcname.entity.ts\n \u2523 \ud83d\udcdc name.controller.spec.ts\n \u2523 \ud83d\udcdc name.controller.ts\n \u2523 \ud83d\udcdc name.module.ts\n \u2523 \ud83d\udcdc name.service.spec.ts\n \u2517 \ud83d\udcdc name.service.ts\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--c-command-service",children:"- C. Command: service"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"nest g service NAME\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsxs)(n.p,{children:["Creates a folder named ",(0,r.jsx)(n.code,{children:"name"}),", with 2 files:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"\ud83d\udcc2 name\n \u2523 \ud83d\udcdc name.service.spec.ts\n \u2517 \ud83d\udcdc name.service.ts\n"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"--d-command-module",children:"- D. Command: module"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Command's form:"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"nest g module NAME\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"- Description:"})}),"\n",(0,r.jsx)("br",{}),"\n",(0,r.jsx)(n.hr,{})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},7010:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>a});var t=s(758);const r={},o=t.createContext(r);function i(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);