### TypeScript
> tsconfig.json: typescript配置文件,主要用于指定待编译的文件和定义编译选项
> shims-tsx.d.ts: 允许.tsx 结尾的文件，在 Vue 项目中编写 jsx 代码
> shims-vue.d.ts: 主要用于 TypeScript 识别.vue 文件，Ts 默认并不支持导入 vue 文件

#### 常用库
- `vue-class-component`: `vue-class-component`是一个 Class Decorator,也就是类的装饰器
- `vue-property-decorator`: `vue-property-decorator`是基于 vue 组织里 `vue-class-component` 所做的拓展
    ```TS
    import { Vue, Component, Inject, Provide, - Prop, Model, Watch, Emit, Mixins } from 'vue-property-decorator'
    ```
- `vuex-module-decorators`: 用 typescript 写 vuex 很好用的一个库
    ```TS
    import { Module, VuexModule, Mutation, Action, MutationAction, getModule } from 'vuex-module-decorators'
    ```