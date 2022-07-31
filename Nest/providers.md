## Providers

Providers 是`Nest`的一个基本概念。许多基本的`Nest`类可能被视为 provider—`service`，`repository`，`factory`，`helper`等等。
它们都可以通过`constructor`注入依赖系统。这意味着对象可以彼此创建各种关系，并且连接对象实例的功能在很大程度上可以委托给`Nest`运行时系统。
Providers只是一个用`@Injectable()`装饰器注释的类。
![控制器-providers](assets/images/providers1.png)

控制器应处理`HTTP`请求并将更复杂的任务委托给`providers`。`Providers`是纯粹的`JavaScript`类，在其声明之前带有`@Injectable()`装饰器。

### Service
```TS
nest g service cats
```
`CatsService`,负责数据存储和检索。唯一的新特点就是使用`@Injectable()`装饰器，该`@Injectable()`附加有元数据，因此`Nest`知道这个类是一个`Nest` provider。

```TS
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```
`CatsService`是通过类构造函数注入的。

### 依赖注入
`Nest`是建立强大的设计模式，通常称为依赖注入。

### 作用域
Provider通常具有与应用程序生命周期同步的生命周期（“作用域”）。在启动应用程序时，必须解析每个依赖项，因此必须实例化每个提供程序。
当应用程序关闭时，每个provider都将被销毁。但是，有一些方法可以改变provider生命周期的请求范围。

### 自定义提供者
`Nest`有一个内置的控制反转("IoC")容器，可以解决providers之间的关系。此功能是上述依赖注入功能的基础，但是要比上面描述的强大。
`@Injectable()`装饰器只是冰山一角, 并不是定义 providers 的唯一方法。

### 可选提供者
要指示provider是可选的，需要在`constructor`的参数中使用`@Optional()`装饰器
```TS
import { Injectable, Optional, Inject } from "@nestjs/common"

@Injectable()
export class HttpService<T>{
    constructor(
        @Optional() @Inject('HTTP_OPTIONS') private readonly httpClient: T
    ){}
}
```
在上面的实例中，使用自定义的`provider`，这时包含`HTTP_OPTIONS`自定义标记的原因。

### 基于属性的注入
在`constructor`中使用的技术称为基于构造函数的注入，即通过构造函数方法注入`providers`。在某些非常特殊的情况下，基于属性的注入可能会有用。
例如，如果顶级类依赖于一个或多个providers，那么通过从构造函数中调用子类中的`super()`来传递它们就会非常麻烦。因此，为了避免这种情况，可以在
属性上用`@Inject()`装饰器。
```TS
import { Injectable, Inject } from '@nestjs/common'

@Injectbale()
export HttpService<T>{
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

### 注册提供者
定义了`CatsService`。并且已经有了该服务的使用者(`CatsController`)，需要在`Nest`中注册该服务，以便它可以执行注入。因此，
需要编辑模块文件(`app.module.ts`)，然后将服务添加到`@Module()`装饰器的`providers`数组中。
```TS
app.module.ts
import { Module } from "@nestjs/common"
import { CatsController } from "./cats/cats.controller"
import { CatsService } from './cats/cats.service'

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})
export calss AppModule {}
```
