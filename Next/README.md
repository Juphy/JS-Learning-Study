### 创建应用
```
npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
cd nextjs-blog
npm run dev
```
### 页面导航
在Nextjs中，页面是从`pages`目录中的文件导出的React组件。
页面与基于其文件名的路由相关联，
```
`pages/index.js` 与 `/` 路由相关联
`pages/posts/first-post.js` 与 `/posts/first-post` 路由相关联
```
### 客户端导航（client-side navigation）
`Link`组件支持在同一个Next.js应用程序中的两个页面之间进行客户端导航
客户端导航意味着页面转换使用JavaScript进行，这比浏览器执行的默认导航更快
验证方法：
- 使用浏览器的开发人员工具将html的background修改
- 单击链接可在两个页面之间来回切换
- 页面的背景在转换之间持续存在
这表明浏览器未加载完整页面并且客户端导航正在工作

### 代码拆分和预取（Code splitting and prefetching）
Next.js会自动进行代码拆分，因此每个页面只加载该页面所需的内容。
这意味着在呈现主页时，最初不会提供其他页面的代码，这可确保即使添加了数百个页面，主页也能快速加载。
仅加载请求的页面代码意味着页面变得鼓励，如果某个页面抛出错误，应用程序的其余部分任然可以工作

### Assets
静态资源放在public下，通过绝对路径`/`进行引用。

### Metadata
```JS
<Head>
    <title>Create Next App</title>
    <link rel="icon" href="/favicon.ico">
</Head>
```

### CSS
要使用CSS Modules，CSS 文件名必须以 .css 结尾.module.css。
`CSS Modules`: 自动生成唯一的类名
Next.js的代码拆分功能也适用于CSS模块，它确保为每个页面加载最少的CSS。
`CSS模块`在构建时从JavaScript包中提取，并生成`.css`由Next.js自动加载的文件。

### 全局组件
在`pages`中添加一个`_app.js`文件
```JS
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```
该`App`组件是顶级组件，它将在不同的页面中通用
在`_app.js`中导入全局CSS，不能在其他地方导入全局CSS

### 预渲染
Next.js有两种形式的预渲染：`静态生成`和`服务端渲染`。不同之处在于何时生成HTML。
- 静态生成是在构建时生成HTML的预渲染方法，然后每个请求上重用预渲染的HTML
- 服务器端渲染是在每个请求上生成HTML的预渲染方法

在开发模式下，运行`npm run dev`或者`yarn dev`，每个页面都会针对每个请求进行`预渲染`————使用静态生成

### Per-page Basis
Next.js允许为每个页面选择要使用的预渲染表单，就是说可以通过对大多数页面使用`静态生成`并为其他页面使用`服务器端渲染`来创建"混合"Next.js应用程序

### 何时使用`静态生成`与`服务器端渲染`
建议尽可能使用`静态生成`(有数据和没有数据)，因为这样页面可以构建一次并由CDN提供服务，这比让服务器在每次请求时呈现页面要快得多。
`静态生成`：如果页面显示经常更新的数据，并且页面内容随每次请求而变化，在这种情况，可以使用`Server-side Rendering`,这样较慢
但是预渲染的页面将始终是最新的。
或者跳过预渲染并使用客户端JavaScript来填充经常更新的数据。
`静态生成`可以在有数据和没有数据的情况下完成。但是，对于某些页面，如果不首先获取一些外部数据，可能无法呈现HTML。

#### Next.js支持`带有数据的静态生成`
在Next.js中，当导出一个页面组件时，可以导出一个`async`名为`getStaticProps`
- `getStaticProps`在生产中构建时运行
- 在函数内部，可以获取外部数据并将其作为道具发送到页面
```JS
export default function Home(props){ ... }

export async function getStaticProps(){
  // get external dat from the file system API DB, etc
  const data = ...

  // the value of the `props` key will be
  // passed to the `Home` component
  return {
    props: ...
  }
}
```
**在开发模式下，`getStaticProps`改为在每个请求上运行**
`getStaticProps`只能从page导出，不能从非页面文件中导出它，这样限制的原因事React需要在呈现页面之前拥有所有必需的数据。

#### 服务器端渲染
在请求时而不是构建时获取数据，要使用`Server-side Rendering`，需要导出`getServerSideProps`而不是`getStaticProps`
`getServerSideProps`在请求时调用，它的参数(`context`)包含请求特定的参数
`getServerSideProps`仅当需要预呈现必须在请求时获取其数据的页面时才应用。到第一个字节的时间(TTFB)将比`getStaticProps`
因为服务器必须计算每个请求的结果要慢，并且结果不能在没有额外配置的情况下被`CDN`缓存。

#### 客户端渲染
如果不做需要预先渲染的数据，也可以使用`客户端渲染`(Client-side Rendering)：
- 静态生成（预渲染）不需要外部数据的页面部分
- 当页面加载时，使用JavaScript从客户端获取外部数据并填充其余部分
适用于用户仪表盘页面，因为仪表盘是一个私人的、用于特定用户的页面，所以SEO不相关，并且该页面不需要预渲染。数据经常更新，这需要请求时获取数据。

### SWR
用于处理缓存、重新验证、焦点追踪、间隔重新获取等
```JS
import useSWR from 'swr'

function Profile(){
  const { data, error } = useSWR('/api/user', fetch)
  if(error) return <div>failed to load.<div>
  if(!data) return <div>loading</div>
  return <div>hello { data.name }!<div>
}
```
### 动态路由

#### falback
- false: 任何未返回会的路径`getStaticPaths`都将导致404页面
- true: 行为`getStaticProps`改变：
  - 返回的路径`getStaticPaths`将在构建时呈现为HTML
  - 还没有在生成时生成的路径将不会导致404，相反，Next.js将在此类路径的第一次请求时提供页面的回退版本
  - 在后台，Next.js将静态生成请求的路径。对同一路径的后续请求将为生成的页面提供服务，就像在构建时预渲染的其他页面一样
- blocking: 新路径将在服务器端用呈现`getStaticprops`, 并缓存以备将来的请求使用，因此每个路径只发生一次

#### Catch-all Routes
通过在`[]`中添加`...`, 扩展动态路由以获取所有路径:
- `pages/posts/[...id].js`匹配`posts/a`, 也匹配`posts/a/b`, `posts/a/b/c`
如果需要这种路由，在`getStaticPaths`中必须返回一个数组作为`id`键的值
```JS
return [
  {
    params: {
      // Statically Generates /posts/ab/b/c
      id: ['a', 'b', 'c']
    }
  }
]
```
### 404页
