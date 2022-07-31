### 介绍

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，使用 TypeScript 构建 （保留与纯 JavaScript 的兼容性），并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。
在底层，Nest使用强大的HTTP Serve框架，如Express和Fastify。Nest在这些框架之上提供了一定程度的抽象，同时也将其API直接暴露给开发人员。

### 建立和运行

```
npm i -g @nestjs/cli
nest new project
```

project 文件中的 src 目录中包含几个核心文件：

```
src
 ├── app.controller.spec.ts  对于基本控制器的单元测试样例
 ├── app.controller.ts  带有单个路由的基本控制器示例
 ├── app.module.ts  应用程序的根模块
 ├── app.service.ts   带有单个方法的基本服务
 └── main.ts  应用程序入口文件，它使用 NestFactory 用来创建 Nest 应用实例。
```

> main.ts 包含一个异步函数，负责引导我们的应用程序。

```TS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

要创建一个 Nest 应用实例，使用 NestFactory.create()方法返回一个实现`INestApplication`接口的对象，并提供一组可用的方法。

```
npm run start
```

此命令在 src 目录中的 main.ts 文件中定义的端口上启动 HTTP 服务器。

### 平台

Nest 旨在成为一个与平台无关的框架。 通过平台，可以创建可重用的逻辑部件，开发人员可以利用这些部件来跨越多种不同类型的应用程序。Nest 可以在创建适配器后使用任何 Node HTTP 框架。 有两个支持开箱即用的 HTTP 平台：express 和 fastify。

- Express: Express 是一个众所周知的 node.js 简约 Web 框架。 这是一个经过实战考验，适用于生产的库，拥有大量社区资源。 默认情况下使用`@nestjs/platform-express`包。 许多用户都可以使用 Express ，并且无需采取任何操作即可启用它。

- Fastify: Fastify 是一个高性能，低开销的框架，专注于提供最高的效率和速度。

无论使用哪种平台，它都会暴露自己的 API，分别是`NestExpressApplication`和`NestFastifyApplication`，将类型传递给 NestFactory.create()函数时，App 对象将具有专用于该特定平台的函数。但是，请注意，除非您确实要访问底层平台 API，否则无需指定类型。

```TS
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```