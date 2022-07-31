### 按需加载
如果你在开发环境的控制台下看到下面的提示，那么你可能使用了`import { button } from 'ant-design-vue'`的写法引入了antd下所有的模块，这会影响应用的网络性能。
```JS
You are using a whole package of antd, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
```
可以通过以下的写法来按需加载组件
```JS
import  button form "ant-design-vue/lib/button"
import 'ant-design-vue/lib/button/style'; // 或者 ant-design-vue/lib/button/style/css
```
如果使用了babel，那么可以使用`babel-plugin-import`来进行按需加载，加入这个插件后
```JS
import { Button } from "ant-design-vue"
```
插件会自动转换成`ant-design-vue/lib/xxx`的写法，另外此插件配合`style`属性可以做到模块样式的按需加载。
**注意，babel-plugin-import的style属性除了引入对应组件的样式，也会引入一些必要的全局样式。如果你不需要它们，建议不要使用此属性。可以import 'ant-design-vue/dist/antd.css 手动引入，并覆盖全局样式。**
```JS
npm i babel-plugin-import --dev
// vue-cli2
// 修改.babelrc文件，配置babel-plugi-import
  {
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
-   "plugins": ["transform-vue-jsx", "transform-runtime"]
+   "plugins": [
+     "transform-vue-jsx",
+     "transform-runtime",
+     ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
+   ]
  }

// vue-cli3
// 修改babel.config.js文件，配置bable-plugin-import  
 module.exports = {
  presets: ["@vue/app"],
+  plugins: [
+    [
+      "import",
+      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
+    ]
+  ]
};
```

### 定制主题
使用`modifyVars`的方式来进行覆盖
#### 在webpack中定制主题
`webpack.config.js`对`less-loader`的options属性进行相应配置，注意less-loader的处理范围不要过滤掉`node_modules`下的antd包。
```JS
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       lessOptions: {  // If you are using less-loader@5 please spread the lessOptions to options directly
+         modifyVars: {
+           'primary-color': '#1DA57A',
+           'link-color': '#1DA57A',
+           'border-radius-base': '2px',
+         },
+         javascriptEnabled: true,
+       }
+     },
    }],
    // ...other rules
  }],
  // ...other config
}
```
#### vue-cli2
修改build/utils.js
```JS
// build/utils.js
- less: generateLoaders('less'),
+ less: generateLoaders('less', {
+   modifyVars: {
+     'primary-color': '#1DA57A',
+     'link-color': '#1DA57A',
+     'border-radius-base': '2px',
+   },
+   javascriptEnabled: true,
+ })
```

#### vue-cli3
项目根目录下新建文件`vue.config.js`
```JS
// vue.config.js for less-loader@6.0.0
module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
```

#### 配置less变量文件
创建一个单独的`less`变量文件，引入这个文件覆盖`antd.less`里的变量
```CSS
@import '~ant-design-vue/dist/antd.less'; // 引入官方提供的 less 样式入口文件
@import 'your-theme-file.less'; // 用于覆盖上面定义的变量
```
这种方式已经载入了所有组件的样式，不需要也无法和按需加载插件`bable-plugin-import`的`style`属性一起使用

#### 没有生效
注意样式必须加载less格式，一个常见的问题就是引入多份样式，less的样式被css的样式覆盖了。
- 如果使用`babel-plugin-import`的style配置来引入样式，需要将配置从`css`改成`true`，这样会引入less文件
- 如果通过`ant-design-vue/dist/antd.css`引入样式的，改为`ant-design-vue/dist/antd.less`

