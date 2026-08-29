# dsh-tool-budget

DeepSeek Harness plugin: **hard-stop** tool use after a **per-session** call budget.

Pairs with [dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop). Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[涓枃璇存槑 鈫揮(#涓枃)

---

## English

### Why

Repeat-stop catches identical spam. Budget catches 鈥渕any different tools forever鈥?in one session鈥攗seful when long WSL tasks burn API quota.

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

### FAQ

**Does this replace dsh-repeat-stop?** No. Repeat-stop blocks identical streaks; this caps total calls per session.

**Will it block job_* tools?** Not by default — they are excluded so long-running shell jobs can still be observed.

**How do I raise the limit?** Set `config.maxCalls` in your profile `cordis.patch.yml` and restart `dsh web`.

### License

MIT

---


## 涓枃

### 涓轰粈涔堥渶瑕?

`repeat-stop` 绠°€屽悓涓€璋冪敤杩炲埛銆嶏紱鏈彃浠剁銆屾暣鍦轰細璇濆伐鍏疯皟鐢ㄦ€绘鏁般€嶏紝闃叉闀夸换鍔℃崲鐫€鑺辨牱绌鸿浆銆佺儳棰濆害銆?

榛樿 80 娆★紝绗?81 娆＄‖鎷︺€傝繖鏄?*瀹夊叏闃€**锛屼笉鏄巿鏉冮檺鍒讹紱瑙夊緱绱у氨璋冨ぇ `maxCalls` 鎴栧叧鎺夈€?

### 瀹夎

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

### 璁稿彲

MIT
