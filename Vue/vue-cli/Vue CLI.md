## Vue CLI
Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统，提供：
- 通过 @vue/cli 实现的交互式的项目脚手架
- 通过 @vue/cli + @vue/cli-service-global 实现的零配置原型开发
- 一个运行时依赖 (@vue/cli-service)，该依赖：
    - 可升级
    - 基于 webpack 构建，并带有合理的默认配置
    - 可以通过项目内的配置文件进行配置
    - 可以通过插件进行扩展
- 一个丰富的官方插件集合，集成了前端生态中最好的工具
- 一套完全图形化的创建和管理 Vue.js 项目的用户界面

### CLI
CLI(`@vue/cli`)是一个全局安装的npm包，提供了终端里的vue命令。
- vue create
- vue serve
- vue ui

### CLI服务
CLI服务(`@vue/cli-service`)是一个开发环境依赖。它是一个npm包，局部安装在每个`@vue/cli`创建的项目中。
CLI服务是构建于`webpack`和`webpack-dev-server`之上的，它包含了：
- 加载其它CLI插件的核心服务
- 一个针对绝大部分应用优化过的内部的webpack配置
- 项目内部的`vue-cli-service`命令，提供了`serve`、`build`、`inspect`命令

`vue-cli-service serve [options] [entry]`:
- --open    在服务器启动时打开浏览器
- --copy    在服务器启动时将 URL 复制到剪切版
- --mode    指定环境模式 (默认值：development)
- --host    指定 host (默认值：0.0.0.0)
- --port    指定 port (默认值：8080)
- --https   使用 https (默认值：false)
`vue-cli-service serve`命令会启动一个开发服务器（基于webpack-dev-serve）并附带开箱即用的模块热重载（Hot-Module-Replacement）



### CLI插件
CLI插件是向你的Vue项目提供可选功能的npm包，例如 Babel/TypeScript 转译、ESLint 集成、单元测试和 end-to-end 测试等。
Vue CLI 插件的名字以 @vue/cli-plugin- (内建插件) 或 vue-cli-plugin- (社区插件) 开头。
当你在项目内部运行 vue-cli-service 命令时，它会自动解析并加载 package.json 中列出的所有 CLI 插件。
插件可以作为项目创建过程的一部分，或在后期加入到项目中。它们也可以被归成一组可复用的 preset。

#### 快速原型开发
使用`vue serve`和`vue build`命令对单个`*.vue`文件进行快速原型开发，不过这需要额外安装一个全局的扩展：
```JS
npm install -g @vue/cli-service-global
```
`vue serve`: 在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器
Options:
- -o, --open  打开浏览器
- -c, --copy  将本地 URL 复制到剪切板
- -h, --help  输出用法信息
```Vue
<template>
  <h1>Hello!</h1>
</template>
```
`vue serve`使用了和`vue create`创建的项目相同的默认设置（webpack、Babel、PostCSS 和 ESLint）。
它会在当前目录自动推导入口文件--入口可以是`main.js`,`index.js`,`App.vue`等，也可以是显式地指定入口文件。

`vue build`: 在生产环境模式下零配置构建一个.js或.vue文件
Options:
- -t, --target <`target`> 构建目标（app | lib | wc | wc-async, 默认值: app）
- -n, --name <`name`> 库的名字或 Web Components 组件的名字（默认值：入口文件名）
- -d, --dest <`dir`> 输出目录（默认值： dist）
- -h, --help 输出用法信息

### 创建项目
`vue create <project>`
```JS
?please pick a preset:
> default (babel, eslint)
    Manually select features
?Check the features needed for your project:
> babel
> TypeScript
> Progressive Web App (PWA) Support
> Router
> Vuex
> CSS Pre-processors
> Linter / Formatter
> Unit Testing
> E2E Testing
```
如果决定手动选择特性，在操作提示的最后可以选择将已选项保存为一个将来可复用的preset。
    
    ~/.vuerc
    被保存的preset将会保存用户的home目录下一个名为`.vuerc`的JSON文件里。如果想要修改被保存的preset/选项，可以编辑这个文件
    在项目创建的过程中，会被提示选择喜欢的包管理器或使用taobaonpm镜像源以便更快地安装依赖，这些选择也将会存入`~/.vuerc`.
`vue create [options] <app-name>`: 创建一个由 `vue-cli-service` 提供支持的新项目
- -p, --preset <presetName>       忽略提示符并使用已保存的或远程的预设选项
- -d, --default                   忽略提示符并使用默认预设选项
- -i, --inlinePreset <json>       忽略提示符并使用内联的 JSON 字符串预设选项
- m, --packageManager <command>  在安装依赖时使用指定的 npm 客户端
- -r, --registry <url>            在安装依赖时使用指定的 npm registry
- -g, --git [message]             强制 / 跳过 git 初始化，并可选的指定初始化提交信息
- -n, --no-git                    跳过 git 初始化
- -f, --force                     覆写目标目录可能存在的配置
- -c, --clone                     使用 git clone 获取远程预设选项
- -x, --proxy                     使用指定的代理创建项目
- -b, --bare                      创建项目时省略默认组件中的新手指导信息
- -h, --help                      输出使用帮助信息

`vue ui`: 以图形化界面创建和管理项目

Vue CLI>=3和旧版使用了相同的`vue`命令，所以Vue CLI2(vue-cli)被覆盖了。如果任然需要使用旧版的`vue init`功能，就需要全局安装一个桥接工具。
```JS
npm install -g @vue/cli-init
# `vue init`的运行效果将会跟`vue-cli@2.x`相同
vue init webpack my-project
```

### 插件和Preset
Vue CLI使用了一套基于插件的架构，所有的依赖都是以`@vue/cli-plugin`开头。插件可以修改webpack的内部配置，也可以向`vue-cli-service`注入命令。在项目创建的过程中，绝大部分列出的特性都是可以通过插件来实现的。

每个CLI插件都会包含一个（用来创建文件的）生成器和一个（用来调整webpack核心配置和注入命令的）运行时插件。当你使用`vue create`来创建一个新的项目的时候，有些插件会根据你选择的特性被预安装好。如果想在一个已经被创建好的项目中安装一个插件，可以使用`vue add`.
`vue add`的设计意图是为了安装和调用Vue CLI插件，这不意味着替换掉普通的npm包。对于这些普通的npm包，仍然需要选用包管理器。
**在运行`vue add`之前将项目的最新状态提交，因为该命令可能调用插件的文件生成器并很有可能更改现有的文件。**
`vue add @vue/eslint`将`@vue/eslint`解析为完整的包名`@vue/cli-plugin-eslint`,然后从npm安装它，调用它的生成器。

如果不带`@vue`前缀，该命令会换作解析一个unscoped的包。
```JS
# 安装并调用vue-cli-plugin-appllo
vue add apollo
```

基于一个指定的scope使用第三方插件，如果一个插件名为`@foo/vue-cli-plugin-bar`,
```JS
vue add @foo/bar
=> vue add @foo/vue-cli-plugin-bar
```

向被安装的插件传递生成器选项（这样做会跳过命令提示）
```JS
vue add eslint --config airbnb --lintOn save
```

如果一个插件已经被安装，可以使用`vue invoke`命令跳过安装过程，只调用它的生成器，这个命令会接受和`vue add`相同的参数。
> 如果出于一些原因你的插件列在了该项目之外的其它`package.json`文件里，你可以在自己项目的`package.json`里设置`vuePlugins.resolveFrom`选项指向包含其它`package.json`的文件夹。
> 例如，如果有一个`.config/package.json`
>```json
>{ 
>   "vuePlugins": { 
>       "resolveFrom": ".config" 
>   } 
>}
>``` 

### 项目本地的插件
如果需要在项目里直接访问插件API而不需要创建一个完整的插件，，可以在`package.json`文件中使用`vuePlugins.service`选项：
```json
{
    "vuePlugins":{
        "service": ["my-commands.js"]
    }
}
```
每个文件都需要暴露一个函数，接受插件API作为第一个参数。
```json
{
    "vuePlugins":{
        "ui": ["my-ui.js"]
    }
}
```

### Preset
一个Vue CLI preset是一个包含创建新项目所需预定义选项和插件的JSON对象，让用户无需在命令提示中选择它们。
在`vue create`过程中保存的preset会被放在你的home目录下的一个配置文件中(`~/.vuerc`)
```json
{
  "useConfigFiles": true,
  "cssPreprocessor": "sass",
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      "config": "airbnb",
      "lintOn": ["save", "commit"]
    },
    "@vue/cli-plugin-router": {},
    "@vue/cli-plugin-vuex": {}
  },
  "configs": { // 为集成工具天机配置
    "vue": {...},
    "postcss": {...},
    "eslintConfig": {...},
    "jest": {...}
  }
}
```
这些额外的配置会根据`useConfigFiles`的值被合并到`package.json`或相应的配置文件中，当`"useConfigFiles": true`的时候，`configs`的值将会被合并到`vue.config.js`中。

### Preset插件的版本管理
```json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      "version": "^3.0.0",
      // ... 该插件的其它选项
    }
  }
}
```
显示地指定用到的插件的版本，当被忽略时，CLI会自动使用registry中最新的版本，**推荐为preset列出的所有第三方插件提供显式的版本范围**

### 允许插件的命令提示
在有些情况下可能希望preset只声明需要的插件，同时让用户通过插件注入的命令提示来保留一些灵活性。对于这种场景可以在插件选项中指定`"prompts": true`来允许注入命令提示：
```json
{
  "plugins": {
    "@vue/cli-plugin-eslint": {
      // 让用户选取他们自己的 ESLint config
      "prompts": true
    }
  }
}
```

### 远程Preset
通过发布git repo将一个preset分享给其他开发者，这个repo应该包含以下文件：
- `preset.json`: 包含preset数据的主要文件
- `generator.js`: 一个可以注入或是修改项目中文件的`Generator`
- `prompts.js`: 一个可以通过命令行对话为generator收集选项的`prompts文件`

发布repo之后，就可以在创建项目的时候通过`--preset`选项使用这个远程的preset：
```sh
# 从Github repo使用preset
vue create --preset username/repo my-project
```

Gitlab和BitBucket也是支持的。如果要从私有repo获取，请确保使用`--clone`选项：
```sh
vue create --preset gitlab:username/repo --clone my-project
vue create --preset bitbucket:username/repo --clone my-project

# 私有服务器
vue create --preset gitlab:my-gitlab-server.com:group/projectname --clone my-project
vue create --preset direct:ssh://git@my-gitlab-server.com/group/projectname.git --clone my-project
```

### 加载文件系统中的preset
当开发一个远程preset的时候，必须向远程repo发出push记性反复测试，为了简化这个流程，可以直接在本地测试preset，如果`--preset`选项的值是一个相对或绝对文件路径，或是以`.json`结尾，则Vue CLI会加载本地的preset：
```sh
# ./my-preset 应当是一个包含 preset.json 的文件夹
vue create --preset ./my-preset my-project

# 或者，直接使用当前工作目录下的 json 文件：
vue create --preset my-preset.json my-project
```