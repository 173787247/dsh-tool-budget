# dsh-tool-budget

DeepSeek Harness plugin: **hard-stop** tool use after a **per-session call budget**.

Pairs with [dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop):

| Plugin | Stops |
|--------|--------|
| `dsh-repeat-stop` | Same tool + same args streak |
| `dsh-tool-budget` | Total tool calls in the session |

Default: **80** tracked calls allowed; the **81st** is denied. Job status tools are excluded by default.

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
# or:
dsh plugin --profile web add /absolute/path/to/dsh-tool-budget
```

Restart `dsh web`. No new tool appears. When it fires, Trajectory shows a tool error starting with `dsh-tool-budget: blocked`.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

## Config

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
    # include: []   # if set, only these names (wildcards ok) count toward the budget
```

## Topics

`dsh-plugin`

## License

MIT
