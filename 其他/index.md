### CI/CD
github actions 基本上是使用github提供的功能，抓取代码，运行测试，登录到远程服务器，发布到第三方服务器，也可以加入飞书机器人
on jobs 当然也可以尝试搭建自己的博客
.github/workflow下面的yaml文件

gitlab 类似配置 主要是运维人员帮忙操作

### 前端换肤
主题切换，覆盖样式实现


### webpack迁移到vite的问题

vite是基于esbuild预构建的，esbuild使用go编写，比JS编写的打包器预构建快10-100倍
启动方式的不同：
webpack会先打包，将各个module生成bundle,再启动开发服务器，给与打包结果
vite直接启动开发服务器，请求那个模块再对那个模块进行实时编译
现代浏览器本身支持ES Module会自动向依赖的Module发出请求，vite