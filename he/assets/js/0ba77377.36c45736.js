"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[2317],{1391:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var s=n(6070),r=n(5710);const o={},i="Guide For Nest JS",a={id:"programming/nest",title:"Guide For Nest JS",description:"1. Nest Objects",source:"@site/docs/programming/nest.md",sourceDirName:"programming",slug:"/programming/nest",permalink:"/guides/he/docs/programming/nest",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/nest.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- Micro-Frontends",permalink:"/guides/he/docs/programming/micro-frontends"},next:{title:"- Node",permalink:"/guides/he/docs/programming/node"}},l={},c=[{value:"<strong>1. Nest Objects</strong>",id:"1-nest-objects",level:2},{value:"- A. Providers",id:"--a-providers",level:3},{value:"- B. Services",id:"--b-services",level:3},{value:"- C. Filters",id:"--c-filters",level:3},{value:"- D. Pipes",id:"--d-pipes",level:3},{value:"\u2022 Type 1: Data Transformation",id:"-type-1-data-transformation",level:4},{value:"\u2022 Type 2: Data Validation",id:"-type-2-data-validation",level:4},{value:"- E. Guards",id:"--e-guards",level:3},{value:"<strong>2. Nest Swagger</strong>",id:"2-nest-swagger",level:2},{value:"- A. Installation",id:"--a-installation",level:3},{value:"- B. Configure &amp; Serve from main.ts",id:"--b-configure--serve-from-maints",level:3},{value:"- C. Adjust TAGs",id:"--c-adjust-tags",level:3},{value:"- D. Param Validation",id:"--d-param-validation",level:3},{value:"- E. Expected Response",id:"--e-expected-response",level:3},{value:"- D. Expected Query",id:"--d-expected-query",level:3}];function d(e){const t={br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"guide-for-nest-js",children:"Guide For Nest JS"}),"\n",(0,s.jsx)(t.h2,{id:"1-nest-objects",children:(0,s.jsx)(t.strong,{children:"1. Nest Objects"})}),"\n",(0,s.jsx)(t.h3,{id:"--a-providers",children:"- A. Providers"}),"\n",(0,s.jsx)(t.p,{children:"Providers in nest are actually services.\nProvider are really just a class, like everything else in nest, but they specifically have an @Injectable() decorator. That means that this provider is something that can be injected into any class that depends on it."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { Injectable } from '@nestjs/common';\nimport { GetUsersDto, LoginDto } from './dto/users.dto';\n\n@Injectable()\nexport class UsersService {\n  async login(body: LoginDto): Promise<string> {\n    console.log('body is:', body);\n    return 'you are logged in!';\n  }\n\n  async getUsers(query: GetUsersDto): Promise<string> {\n    console.log('query is:', query);\n    return 'get users';\n  }\n}\n"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';\nimport { GetUsersDto, LoginDto } from './dto/users.dto';\nimport { UsersService } from './users.service';\n\n@Controller('users')\nexport class UsersController {\n  constructor(private readonly usersService: UsersService) {}\n\n  @Get()\n  async getUsers(@Query() query: GetUsersDto): Promise<string> {\n    const response = await this.usersService.getUsers(query);\n\n    return response;\n  }\n\n  @Post('login')\n  async login(@Body() body: LoginDto): Promise<string> {\n    const response = await this.usersService.login(body);\n\n    return response;\n  }\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"--b-services",children:"- B. Services"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"nest g service isAuthenticated\n"})}),"\n",(0,s.jsx)(t.h3,{id:"--c-filters",children:"- C. Filters"}),"\n",(0,s.jsx)(t.p,{children:"HttpException"}),"\n",(0,s.jsx)(t.h3,{id:"--d-pipes",children:"- D. Pipes"}),"\n",(0,s.jsx)(t.p,{children:'You can think of pipes in nest as kind of "middleware".'}),"\n",(0,s.jsx)(t.p,{children:"Pipes in nest are used for 2 main purposes: data transformation & data validation."}),"\n",(0,s.jsx)(t.p,{children:"So it's either to transform your data, or to validate your data."}),"\n",(0,s.jsx)(t.h4,{id:"-type-1-data-transformation",children:"\u2022 Type 1: Data Transformation"}),"\n",(0,s.jsxs)(t.p,{children:["The simplest way to explain data transformation, is the very common use case getting ",(0,s.jsx)(t.code,{children:":path"})," as a string, when it is in fact wanted as an integer.\nSince ",(0,s.jsx)(t.code,{children:"path"})," always comes as a string, we would need to convert it to a number every time. Using a pipe, you could have its value transformed to int. Nest has many of those built-in pipes. One of them is called ",(0,s.jsx)(t.code,{children:"ParseIntPipe"}),", which you can use just for that case:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",metastring:"{6} showLineNumbers",children:"/* eslint-disable */\n@Controller()\nexport class GatewayController {\n\tconstructor(private readonly httpService: HttpService) {}\n\n    @Get(':id')\n    getOnUser(@Param('id', ParseIntPipe) id: number) {\n        try {\n            return this.service.getUser(id);\n        } catch (err) {\n            throw new NotFoundException();\n        }\n    }\n}\n"})}),"\n",(0,s.jsx)(t.p,{children:"You can, of course, create your own pipes. Nest allows you to do that very easily."}),"\n",(0,s.jsx)(t.h4,{id:"-type-2-data-validation",children:"\u2022 Type 2: Data Validation"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"title=create-user.dto.ts {1,4,8} showLineNumbers",children:"import { MinLength } from 'class-validator';\n\nexport class CreateUserDto {\n    @MinLength(3)\n    name: string;\n\n    // You can even provide your own customized error message.\n    @IsEnum(['dog', 'cat'], { message: 'Use correct Pet!' })\n    pet: 'dog' | 'cat';\n}\n"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"title=users.controller.ts {6} showLineNumbers",children:"import { CreateUserDto } from './create-user-dto.ts';\n\n// ...\n\n@Post()\ncreateUser(@Body(new ValidationPipe) createUserDto){\n    return this.service.createUser(createUserDto);\n}\n"})}),"\n",(0,s.jsxs)(t.p,{children:["If the validation fails, it automatically knows to throw a ",(0,s.jsx)(t.code,{children:"BadRequestException"})," with a 400 status code."]}),"\n",(0,s.jsx)(t.h3,{id:"--e-guards",children:"- E. Guards"}),"\n",(0,s.jsx)(t.p,{children:"A guard is a class annotated with the @Injectable() decorator, which implements the CanActivate interface."}),"\n",(0,s.jsx)(t.p,{children:"Guards really only have a single responsibility, which is to protect the underlying routes based on some kind of logic."}),"\n",(0,s.jsx)(t.p,{children:"For example, authentication & authorization."}),"\n",(0,s.jsx)(t.p,{children:"We will use the CLI to generate a guard:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"nest g guard isAuthenticated\n"})}),"\n",(0,s.jsx)(t.p,{children:"This will create 2 files for you:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"src/isAuthenticated/isAuthenticated.guard.spec.ts"}),"\n",(0,s.jsx)(t.li,{children:"src/isAuthenticated/isAuthenticated.guard.ts"}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["A Guard is just another class with the @Injectable() decorator, kind of like a provider, only that it implements the ",(0,s.jsx)(t.code,{children:"CanActivate"})," interface. The interface simply returns a true or false value. The core idea behind a Guard is that you can attach a guard either to a controller, or to individual methods on a controller."]}),"\n",(0,s.jsxs)(t.p,{children:["When the value returned by that Guard is ",(0,s.jsx)(t.code,{children:"true"}),", the requests moves on to the route.",(0,s.jsx)(t.br,{}),"\n","If the Guard returns ",(0,s.jsx)(t.code,{children:"false"})," as its value, the process stops, and a 403 forbidden exception is returned by default."]}),"\n",(0,s.jsx)(t.p,{children:"The way you'd use a Guard on your controller is by using the @UseGuard() decorator."}),"\n",(0,s.jsx)(t.p,{children:"Here's an example of using @UseGuard() on a controller, which will protect all of its routes:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"{4} showLineNumbers",children:"import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';\n\n@Controller('users')\n@UseGuards(IsAuthenticatedGuard)\nexport class UserController{\n    constructor(private readonly usersService: UserService) {}\n\n    @Get()\n    getUsers(){\n        return this.usersService.getUsers();\n    }\n\n    @Get(:id)\n    getOneUser(@Param() id: string){\n        return this.usersService.getUsers(id);\n    }\n}\n"})}),"\n",(0,s.jsx)(t.p,{children:"And here's an example of using @UseGuard() on a single route, to protect only that route:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"{8} showLineNumbers",children:"import { IsAuthenticatedGuard } from './IsAuthenticatedGuard.guard';\n\n@Controller('users')\nexport class UserController{\n    constructor(private readonly usersService: UserService) {}\n\n    @Get()\n    @UseGuards(IsAuthenticatedGuard)\n    getUsers(){\n        return this.usersService.getUsers();\n    }\n\n    @Get(:id)\n    getOneUser(@Param() id: string){\n        return this.usersService.getUsers(id);\n    }\n}\n"})}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"ExecutionContext"}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["How to decide whether to return true or false is up to your business logic.",(0,s.jsx)(t.br,{}),"\n","Check out the code below. You can see that we're passing an ",(0,s.jsx)(t.code,{children:"ExecutionContext"})," object, and what you'd usually want to do is parse the request out of that context."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"/* eslint-disable */\nimport { Observable } from 'rxjs';\nimport { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class IsAuthenticatedGuard implements CanActivate {\n\tcanActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {\n        const request = context.switchToHttp().getRequest();\n\n        // validation flow process:\n        const isAllowed = request.user.belts.includes('black');\n\n\t\treturn isAllowed;\n\t}\n}\n"})}),"\n",(0,s.jsx)(t.h2,{id:"2-nest-swagger",children:(0,s.jsx)(t.strong,{children:"2. Nest Swagger"})}),"\n",(0,s.jsx)(t.h3,{id:"--a-installation",children:"- A. Installation"}),"\n",(0,s.jsx)(t.p,{children:"First you need to install a couple things:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"yarn add @nestjs/swagger swagger-ui-express\n"})}),"\n",(0,s.jsx)(t.h3,{id:"--b-configure--serve-from-maints",children:"- B. Configure & Serve from main.ts"}),"\n",(0,s.jsxs)(t.p,{children:["Next you need to go to ",(0,s.jsx)(t.code,{children:"main.ts"})," file:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"title=main.ts {3,9-17} showLineNumbers",children:"/* eslint-disable */\nimport { NestFactory } from '@nestjs/core';\nimport { NestExpressApplication } from '@nestjs/platform-express';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { AppModule } from './modules/app.module';\n\nasync function bootstrap() {\n    const app = await NestFactory.create<NestExpressApplication>(AppModule);\n\n\tconst config = new DocumentBuilder()\n\t\t.setTitle('API Gateway')\n\t\t.setDescription('The Gateway app for all services.')\n\t\t.setVersion('1.0.0')\n\t\t.build();\n\n\tconst document = SwaggerModule.createDocument(app, config);\n\n\tSwaggerModule.setup('/', app, document);\n\n\tawait app.listen(8000, () => console.log('app is running on 8000'));\n}\n\nbootstrap();\n"})}),"\n",(0,s.jsxs)(t.p,{children:["The '/' tells nest where to serve swagger-ui. In the above case, it will be served on ",(0,s.jsx)(t.code,{children:"http://localhost:8000"}),"."]}),"\n",(0,s.jsx)(t.h3,{id:"--c-adjust-tags",children:"- C. Adjust TAGs"}),"\n",(0,s.jsx)(t.p,{children:"You can add TAGs to controllers, to have them grouped differently:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"{1} showLineNumbers",children:"/* eslint-disable */\n@ApiTags('infra-chat-service')\n@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Get('is-alive')\n  isAlive(): string {\n    return 'OK';\n  }\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"--d-param-validation",children:"- D. Param Validation"}),"\n",(0,s.jsx)(t.p,{children:"When using Dto objects, swagger-ui will be populated with the schemas already down at the bottom. To have routes make validations of those schemes, you can use something called an @ApiProperty decorator. Go to the Dto file inside the project and add the following:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"title=create-user.dto.ts {4,7} showLineNumbers",children:"import { ApiProperty } from './@nestjs/swagger';\n\nexport class CreateUserDto {\n    @ApiProperty()\n    name: string;\n\n    @ApiProperty({ required: false })\n    age?: number;\n}\n"})}),"\n",(0,s.jsx)(t.p,{children:"The only \"gotcha\" above is that the @ApiProperty does not automatically catch the '?' which mark that a prop is optional. You need to specify that inside the @ApiProperty decorator."}),"\n",(0,s.jsx)(t.h3,{id:"--e-expected-response",children:"- E. Expected Response"}),"\n",(0,s.jsx)(t.p,{children:"You are able to represent the schema for the response using the @ApiCreatedResponse decorator."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"title=user.controller.ts {6,12} showLineNumbers",children:"@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Post()\n  @ApiCreatedResponse({ type: User })\n  createUser(@Body() body: CreateUserDto) {\n    return this.service.createUser();\n  }\n\n  @Get()\n  @ApiOkResponse({ type: User, isArray: true, description: 'Get multiple users' })\n  getUsers(@Query(name) name?: string) {\n    return this.service.getUsers();\n  }\n\n  @Get(':id')\n  @ApiNotFoundResponse()\n  getOnUser(@Param('id', ParseIntPipe) id: number) {\n    const user = this.service.getUser(id);\n\n    if (!user) throw new NotFoundException();\n\n    return user;\n  }\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"--d-expected-query",children:"- D. Expected Query"}),"\n",(0,s.jsx)(t.p,{children:"When fetching an array of objects, you often filter out using query params. This is the most common use-case for the @Query() decorator of nest. You can let swagger know of the structure of your query params using the @ApiQuery() decorator."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"{6} showLineNumbers",children:"@Controller()\nexport class GatewayController {\n  constructor(private readonly httpService: HttpService) {}\n\n  @Get()\n  @ApiQuery({ name: 'name', required: false })\n  getUsers(@Query(name) name?: string) {\n    return this.service.getUsers();\n  }\n}\n"})}),"\n",(0,s.jsx)(t.p,{children:"Note that once again, the '?' isn't telling swagger that this prop is optional, you need to specify that explicitly within the @ApiQuery decorator."})]})}function u(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},5710:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>a});var s=n(758);const r={},o=s.createContext(r);function i(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);