import {
  formatBlockMessage,
  nextCount,
  readMaxCalls,
  toPatterns,
  tracked,
} from "./lib/budget.js";

export const name = "dsh-tool-budget";
export const inject = ["tools", "systemPrompt"];

/**
 * Cap total tool calls per agent session. Complements dsh-repeat-stop
 * (identical-call streak) with a session-wide ceiling.
 * Agent Teams: each teammate agent has its own budget (WeakMap per agent).
 */
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();

  if (!enabled) {
    console.log("[dsh-tool-budget] disabled");
    return;
  }

  console.log(`[dsh-tool-budget] loaded maxCalls=${maxCalls}`);

  ctx.systemPrompt?.section?.({
    name: "plugin:dsh-tool-budget",
    order: 41,
    text: `Tool calls are capped at ${maxCalls} per agent session (dsh-tool-budget). Agent Teams multiplies spend across teammates — keep subagents short or raise maxCalls only when needed.`,
  });

  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return counts.get(exec.agent);
    counted.add(exec);
    const next = nextCount(counts.get(exec.agent));
    counts.set(exec.agent, next);
    return next;
  }

  ctx.tools.guard((exec) => {
    const count = observe(exec);
    if (count === undefined || count <= maxCalls) return undefined;
    return formatBlockMessage(exec.name, maxCalls, count);
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
  });
}