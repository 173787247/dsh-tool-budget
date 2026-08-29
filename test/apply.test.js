import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apply } from "../index.js";

function mockCtx() {
  const guards = [];
  return {
    tools: {
      guard(fn) {
        guards.push(fn);
      },
    },
    on() {},
    guards,
  };
}

function call(agent, name, args = {}) {
  return { agent, name, arguments: args };
}

describe("apply", () => {
  it("blocks after maxCalls distinct or repeated tools", () => {
    const ctx = mockCtx();
    apply(ctx, { maxCalls: 2, exclude: [] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "bash", { command: "a" })), undefined);
    assert.equal(guard(call(agent, "bash", { command: "b" })), undefined);
    assert.match(guard(call(agent, "read_file", { path: "x" })), /blocked read_file after 2/);
  });

  it("does not install a guard when disabled", () => {
    const ctx = mockCtx();
    apply(ctx, { enabled: false });
    assert.equal(ctx.guards.length, 0);
  });

  it("skips excluded tools", () => {
    const ctx = mockCtx();
    apply(ctx, { maxCalls: 1, exclude: ["job_*"] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "job_list")), undefined);
    assert.equal(guard(call(agent, "bash")), undefined);
    assert.match(guard(call(agent, "bash")), /blocked bash after 1/);
  });
});
