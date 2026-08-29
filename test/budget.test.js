import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
});

describe("nextCount", () => {
  it("increments from undefined", () => {
    assert.equal(nextCount(undefined), 1);
    assert.equal(nextCount(3), 4);
  });
});
