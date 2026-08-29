import {
  nextCount,
  readMaxCalls,
  toPatterns,
  tracked,
} from "./lib/budget.js";

export const name = "dsh-tool-budget";
export const inject = ["tools"];

/**
 * Cap total tool calls per agent session. Complements dsh-repeat-stop
 * (identical-call streak) with a session-wide ceiling.
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
    return [
      `dsh-tool-budget: blocked ${exec.name} after ${maxCalls} tool calls this session.`,
      "Finish with what you have, ask the user, or start a new session.",
      `count=${count} maxCalls=${maxCalls}`,
    ].join(" ");
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
  });
}
