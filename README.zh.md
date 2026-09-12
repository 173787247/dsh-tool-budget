# dsh-tool-budget

DeepSeek Harness 插件：按**单场会话**工具调用预算做**硬拦截**。

与 [dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop) 搭配。属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

---
## 兼容性

| 项 | 值 |
|----|----|
| **插件** | `dsh-tool-budget` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Windows 中继 `:3081` 一次性 `?token=`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.1.5-rc.1`**）— 套件唯一真源 |
| **套件档位** | `daily`（亦含于 `github` / `full`；fetch+net 亦在 `llm`） |
| **云端 Flash** | settings / `llm-deepseek` 使用 **`deepseek-flash`**（V4.1 Flash）；本插件不配置模型 id |
| **Agent Teams** | 上游实验包；本插件不依赖 |

套件版本地板：[`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh)。故障树：[TROUBLESHOOTING.zh.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.zh.md)。

## 为什么需要

`dsh-repeat-stop` 管的是「同一工具 + 同一参数」连击刷屏。本插件管的是「一场会话里换着花样调很多工具、没完没了」——长 WSL 任务容易把 API 额度烧光时特别有用。

默认允许 **80** 次计入统计的调用，第 **81** 次拒绝。`job_*` 状态类工具默认不计。

这是一条**安全护栏**，不是产品授权上限。觉得紧就调大 `maxCalls`，或关掉。

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

重启 `dsh web`。不会出现新工具。拦截时 Trajectory 显示 `dsh-tool-budget: blocked`。

## 配置

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
    # include: []   # 若设置，则只统计这些名称
```

| 键 | 默认 | 含义 |
|----|------|------|
| `enabled` | `true` | 总开关 |
| `maxCalls` | `80` | 每场会话允许计入的调用次数 |
| `exclude` | job_* | 不计次的工具名 |
| `include` | （空） | 若设置，则只统计这些名称 |

## 与 dsh-repeat-stop 的区别

| 插件 | 拦截对象 |
|------|----------|
| `dsh-repeat-stop` | 连续相同调用 |
| `dsh-tool-budget` | 整场会话工具总次数 |

## 测试

```sh
npm test
```

## 常见问题

**会不会取代 dsh-repeat-stop？** 不会。repeat-stop 拦相同连击；本插件限制整场会话总次数。

**会拦 job_* 吗？** 默认不会——它们在排除列表里，方便观察长时间跑的 shell 任务。

**怎么提高上限？** 在 profile 的 `cordis.patch.yml` 里设置 `config.maxCalls`，然后重启 `dsh web`。

## 许可

MIT
