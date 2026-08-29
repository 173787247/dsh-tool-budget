# dsh-tool-budget

DeepSeek Harness plugin: **hard-stop** tool use after a **per-session** call budget.

Pairs with [dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop). Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 ↓](#中文)

---

## English

### Why

Repeat-stop catches identical spam. Budget catches “many different tools forever” in one session—useful when long WSL tasks burn API quota.

Default: **80** tracked calls allowed; the **81st** is denied. Job status tools are excluded by default.

This is a **safety rail**, not a product license limit. Raise `maxCalls` or disable if it feels tight.

### Install

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

Restart `dsh web`. No new tool. Blocks show as `dsh-tool-budget: blocked` in Trajectory.

### Config

```yaml
- id: dsh-tool-budget
  name: dsh-tool-budget
  config:
    enabled: true
    maxCalls: 80
    exclude:
      - job_output
      - job_list
      - job_kill
    # include: []   # if set, only these names count
```

| Key | Default | Meaning |
|-----|---------|---------|
| `enabled` | `true` | Master switch |
| `maxCalls` | `80` | Allowed tracked calls per session |
| `exclude` | job_* | Names that do not count |
| `include` | (empty) | If set, only these names count |

### Test

```sh
npm test
```

### License

MIT

---

## 中文

### 为什么需要

`repeat-stop` 管「同一调用连刷」；本插件管「整场会话工具调用总次数」，防止长任务换着花样空转、烧额度。

默认 80 次，第 81 次硬拦。这是**安全阀**，不是授权限制；觉得紧就调大 `maxCalls` 或关掉。

### 安装

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

### 许可

MIT
