### webpack

现在常用的构建工具，主要是通过抓取-编译-构建整个应用的代码，生成一份编译优化后能良好兼容各个浏览器的生产环境的代码。
在开发环境流程也基本相同，需要先将整个应用构建打包后，在把打包后的代码交给`dev serve`开发服务器
随着前端业务的复杂化，JS 代码量呈指数增长，打包构建的事件越来越长:

- 缓慢的服务启动
- 缓慢的 HMR 热更新

### Vite

基于 esbuild 和 Rollup, 依靠浏览器自身 ESM 编译功能,实现极致开发体验的新一代构建工具。

- 依赖: 指开发中不会变动的部分，esbuild 进行预构建
- 源码: 浏览器不能直接执行的非 JS 代码(.jsx .css .vue 等) vite 只在浏览器请求相关相关源码时候进行转换，已提供 ESM 源码

#### 开发环境

- 利用浏览器原生的`ES Module`能力, 省略费时的编译环节，直给浏览器开发环境的源码，dev server 只提供轻量服务
- 浏览器执行 ESM 的`import`时,会向 dev server 发起改模块的 ajax 请求，服务器对源码做简单处理后返回给浏览器
- Vite 中 HMR 是在原生 ESM 上执行的，当编辑一个文件时，Vite 只需要精准地使已编辑的模块失活，使得无论应用大小如何，HMR 始终能保持快速更新
- 使用`esbuild`处理项目依赖，esbuild 使用 go 编写，比 nodejs 编写的编译器快几个数量级

#### 生产环境

继承 Rollup 打包生成环境代码，依赖其成熟稳定的生态与更简洁的插件机制

#### 处理流程对比

webpack 先将整个应用打包，再将打包后的代码提供给`dev server`，开发者才能开发。
通过配置文件，找到入口 entry。从入口文件开始递归识别模块依赖，遇到类似于 require、import 时，webpack 都会对其分析，
从而获得相应的代码依赖。在获得的代码进行分析、转换、编译生成 bundle，浏览器可以识别的代码，最后再启动开发服务器。
vite 会先启动一个`dev server`,获得一个 index.html 文件, index.html 文件中有一个 main.js 文件，类型为 module,
然后就发一个请求获得此文件，在解析文件时遇到 import 引入文件都会发送请求，这样就达到了按需加载的目的，对于非 JS 文件基本上
制作简单的转换处理，并不编译，JS 文件直接返回。

### 实现原理

ESBuild 编译
`esbuild`使用 go 编写，cpu 密集下更具有性能优势，编译速度更快。

#### 依赖预构建

- 模块化兼容: Vite 在预构建阶段将依赖中各种其他模块化规范转换成 ESM, 已提供给浏览器
- 性能优化: npm 包中大量的 ESM 代码，大量的 import 请求，会造成网络拥塞，vite 使用 esbuild 将大量内部的 ESM 关系转换成单个模块，
  减少 import 模块请求次数

#### 按需加载

服务器只在接受到 import 请求的时候，才会编译对应的文件，将 ESM 源码返回给浏览器，实现真正的按需加载

#### 缓存

- HTTP 缓存: 充分利用 http 做缓存处理，依赖部分做强缓存，源码部分用作 304 协商缓存，提升页面打开速度
- 文件系统缓存: Vite 在预构建阶段，将构建后的依赖缓存到`node_modules/.vite`，相关配置修改时，
  或者手动控制时才会重新构建，以提升预构建速度

#### 重写模块路径

### 源码分析

与`webpack-dev-server`类似 vite 同样使用`WebSocket`与客户端连接，实现热更新，源码实现基本分成两个部分

- `vite/packahes/vite/src/client` client 客户端
- `vite/packages/vite/src/node` server 用于开发服务器

client 代码会在启动服务时注入到客户端，用于客户端对于 websocket 消息的处理（如更新页面某个模块，刷新页面）
server 代码是服务端逻辑，用于处理代码的构建与页面模块的请求

1. 命令行启动服务`npm run dev`后，源码执行`cli.js`

```JS
const { createServer } = await Promise.resolve().then(function () { return require('./chunks/dep-611778e0.js'); }).then(function (n) { return n.index$1; });
try {
    const server = await createServer({
        root,
        base: options.base,
        ...
    });
    if (!server.httpServer) {
        throw new Error('HTTP server not available');
    }
    await server.listen();
}
```
2. `createServer`方法做了很多工作，如整合配置项、创建http服务、创建websocket服务、
创建源码的文件监听、插件执行、optimize优化等
```JS
async function createServer(inlineConfig = {}) {
    // 整合配置
    const config = await resolveConfig(inlineConfig, 'serve', 'development');
    const root = config.root;
    const serverConfig = config.server;
    const httpsOptions = await resolveHttpsConfig(config.server.https, config.cacheDir);
    let { middlewareMode } = serverConfig;
    if (middlewareMode === true) {
        middlewareMode = 'ssr';
    }
    const middlewares = connect();
    // 创建http服务
    const httpServer = middlewareMode
        ? null
        : await resolveHttpServer(serverConfig, middlewares, httpsOptions);
    // 创建ws服务    
    const ws = createWebSocketServer(httpServer, config, httpsOptions);
    const { ignored = [], ...watchOptions } = serverConfig.watch || {};
    // 创建watcher，设置代码文件监听
    const watcher = chokidar.watch(path__default.resolve(root), {
        ignored: [
            '**/node_modules/**',
            '**/.git/**',
            ...(Array.isArray(ignored) ? ignored : [ignored])
        ],
        ignoreInitial: true,
        ignorePermissionErrors: true,
        disableGlobbing: true,
        ...watchOptions
    });
    const moduleGraph = new ModuleGraph((url, ssr) => container.resolveId(url, undefined, { ssr }));
    const container = await createPluginContainer(config, moduleGraph, watcher);
    const closeHttpServer = createServerCloseFn(httpServer);
    // eslint-disable-next-line prefer-const
    let exitProcess;
    const server = {
        config,
        middlewares,
        get app() {
            config.logger.warn(`ViteDevServer.app is deprecated. Use ViteDevServer.middlewares instead.`);
            return middlewares;
        },
        httpServer,
        watcher,
        pluginContainer: container,
        ws,
        moduleGraph,
        ssrTransform,
        transformWithEsbuild,
        transformRequest(url, options) {
            return transformRequest(url, server, options);
        },
        transformIndexHtml: null,
        async ssrLoadModule(url, opts) {
            if (!server._ssrExternals) {
                let knownImports = [];
                const optimizedDeps = server._optimizedDeps;
                if (optimizedDeps) {
                    await optimizedDeps.scanProcessing;
                    knownImports = [
                        ...Object.keys(optimizedDeps.metadata.optimized),
                        ...Object.keys(optimizedDeps.metadata.discovered)
                    ];
                }
                server._ssrExternals = resolveSSRExternal(config, knownImports);
            }
            return ssrLoadModule(url, server, undefined, undefined, opts === null || opts === void 0 ? void 0 : opts.fixStacktrace);
        },
        ssrFixStacktrace(e) {
            if (e.stack) {
                const stacktrace = ssrRewriteStacktrace(e.stack, moduleGraph);
                rebindErrorStacktrace(e, stacktrace);
            }
        },
        ssrRewriteStacktrace(stack) {
            return ssrRewriteStacktrace(stack, moduleGraph);
        },
        listen(port, isRestart) {
            return startServer(server, port, isRestart);
        },
        async close() {
            process.off('SIGTERM', exitProcess);
            if (!middlewareMode && process.env.CI !== 'true') {
                process.stdin.off('end', exitProcess);
            }
            await Promise.all([
                watcher.close(),
                ws.close(),
                container.close(),
                closeHttpServer()
            ]);
        },
        printUrls() {
            if (httpServer) {
                printCommonServerUrls(httpServer, config.server, config);
            }
            else {
                throw new Error('cannot print server URLs in middleware mode.');
            }
        },
        async restart(forceOptimize) {
            if (!server._restartPromise) {
                server._forceOptimizeOnRestart = !!forceOptimize;
                server._restartPromise = restartServer(server).finally(() => {
                    server._restartPromise = null;
                    server._forceOptimizeOnRestart = false;
                });
            }
            return server._restartPromise;
        },
        _optimizedDeps: null,
        _ssrExternals: null,
        _globImporters: Object.create(null),
        _restartPromise: null,
        _forceOptimizeOnRestart: false,
        _pendingRequests: new Map()
    };
```