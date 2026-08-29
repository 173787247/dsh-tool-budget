import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatBlockMessage,
  nextCount,
  readMaxCalls,
  toPatterns,
  tracked,
} from "../lib/budget.js";

describe("readMaxCalls", () => {
  it("defaults and rejects non-positive", () => {
    assert.equal(readMaxCalls(undefined), 80);
    assert.equal(readMaxCalls(0), 80);
    assert.equal(readMaxCalls(12), 12);
  });

  it("rejects non-integers and empty string", () => {
    assert.equal(readMaxCalls(1.5), 80);
    assert.equal(readMaxCalls(""), 80);
    assert.equal(readMaxCalls("nope"), 80);
    assert.equal(readMaxCalls(-3), 80);
  });
});

describe("tracked", () => {
  it("honors exclude wildcards", () => {
    const exclude = toPatterns(["job_*"]);
    assert.equal(tracked("job_list", [], exclude), false);
    assert.equal(tracked("bash", [], exclude), true);
  });

  it("honors include when set", () => {
    const include = toPatterns(["bash", "net_*"]);
    assert.equal(tracked("bash", include, []), true);
    assert.equal(tracked("net_doctor", include, []), true);
    assert.equal(tracked("read_file", include, []), false);
  });

  it("treats non-array patterns as empty", () => {
    assert.deepEqual(toPatterns(null), []);
    assert.equal(tracked("bash", [], []), true);
  });
});

describe("nextCount", () => {
  it("increments from undefined", () => {
    assert.equal(nextCount(undefined), 1);
    assert.equal(nextCount(3), 4);
  });
});

describe("formatBlockMessage", () => {
  it("includes tool name and counts", () => {
    const msg = formatBlockMessage("bash", 80, 81);
    assert.match(msg, /blocked bash after 80/);
    assert.match(msg, /count=81 maxCalls=80/);
  });
});