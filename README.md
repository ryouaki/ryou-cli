# ryou-cli
用于快速新建项目的工程模板生成工具，目前支持一下框架模板：
- Vue(SPA): (完成)Vue + Vuex + VueRouter
- Vue(First-render): (开发中)基于nuxt
- Vue(SSR): (开发中)基于nuxt
- React(SPA): (开发中)
- React(First-render): (开发中)
- React(SSr): (开发中)基于nest
- Expressjs(API): (开发中)
- KOA(API): (开发中)
- Nginx spa history configuration: (完成)

## 使用

安装：
```sh
  npm install -g ryou-cli
```

构建项目：
```sh
  ryoucli init <项目名称>
```

按提示输入信息：
```sh
  ? Which template do you want to choice? Vue(SPA)
  ? Description: Test project
  ? Author: ryouaki
  √ downloading...
  √ The project initialized successful!
  √ npm installing...
  √ Npm install successful!

  √ Run command:
  √   $ cd D:\Workspace\ryou-cli\test
  √   $ npm run dev
```
