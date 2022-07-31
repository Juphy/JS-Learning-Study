## 组合式API
### `setup`组件选项
新的setup选项在组件创建`之前`执行，一旦`props`解析，就将作为组合式API的入口。
```JS
在`setup`中应该避免使用this，因为不会找到组件实例，`setup`的调用发生在
`data`property、`computed` property 或 `methods`被解析之前，所以它们无法在 `setup`中获取。
```
`setup`选项时一个接收`props`和`context`的函数，返回的所有内容都暴露给组件的其余部分（计算属性，方法，生命周期钩子等等）以及组件的模板

### 带ref的响应式变量
```TS
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```
`ref`接收参数并将其包裹在一个带有`value`property的对象中返回，然后可以使用改property访问或更改响应式变量的值。

将值封装在一个对象中，是为了保持JavaScript中不同数据类型的行为统一，因为在JavaScript中，`Number`和`String`等基本类型是通过值而非引用传递的。

`ref`为基本类型的值创建了一个`响应式引用`。

### 在`setup`内注册生命周期钩子
组合式API上的生命周期钩子与选项式API的名称相同，但前缀为`on`: 即`mounted`变成`onMounted`。

### `watch`响应式更改
与在组件中使用`watch`选项并在`user`property上设置侦听器是一样的：
- 一个想要侦听的`响应式引用`或getter函数
- 一个回调
- 可选的配置选项

```TS
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// 在我们组件中
setup (props) {
  // 使用 `toRefs` 创建对prop的 `user` property 的响应式引用
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新 `prop.user` 到 `user.value` 访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在 user prop 的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

### 独立的`computed`属性
与`ref`和`watch`类似，也可以使用从Vue导入`computed`函数在Vue组件外部创建计算属性。
```TS
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```
`computed`函数传递的参数吗，类似getter的回调函数，输出的是一个只读的`响应式引用`.
```TS
// src/composables/useUserRepositories.js
// 查询功能

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
```
```TS
// src/composables/useRepositoryNameSearch.js
// 搜索功能

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```
```TS
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```