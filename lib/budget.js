export const DEFAULT_MAX_CALLS = 80;

export function readMaxCalls(value, fallback = DEFAULT_MAX_CALLS) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    console.warn(`[dsh-tool-budget] invalid maxCalls ${JSON.stringify(value)}; using ${fallback}`);
    return fallback;
  }
  return n;
}

export function toPatterns(list) {
  if (!Array.isArray(list)) return [];
  return list.map((pattern) => wildcardToRegExp(String(pattern)));
}

export function wildcardToRegExp(pattern) {
  const escaped = pattern.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("*", ".*")}$`);
}

export function tracked(toolName, includePatterns, excludePatterns) {
  if (includePatterns.length > 0 && !includePatterns.some((re) => re.test(toolName))) {
    return false;
  }
  return !excludePatterns.some((re) => re.test(toolName));
}

export function nextCount(previous) {
  return (previous ?? 0) + 1;
}
