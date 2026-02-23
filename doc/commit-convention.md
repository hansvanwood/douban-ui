# Git 提交规范

本项目采用 **Conventional Commits** 规范，提交信息格式如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: `feat`（新功能）、`fix`（修复 bug）、`docs`（文档）、`style`（代码格式）、`refactor`（重构）、`test`（添加测试）、`chore`（构建过程或辅助工具变动）
- **scope**（可选）: 影响的模块或功能，例如 `ui`、`api`、`store` 等。
- **subject**: 简短描述，首字母小写，不要以句号结尾。
- **body**（可选）: 详细说明，使用换行分隔。
- **footer**（可选）: 关联的 issue、BREAKING CHANGE 等。

示例：

```
feat(ui): 添加首页背景图和遮罩

- 将背景图移动到 .home-page 并添加半透明遮罩
- 更新相关样式和动画
```

使用 `npm run commit`（或 `git commit`）时，commitlint 会自动校验提交信息。
