## 中间件
中间件是在路由处理程序之前调用的函数。中间件函数可以访问请求和响应对象，
以及应用程序响应周期中的`next()`中间件函数。`next()`中间件函数通常由名为`next`的变量表示。