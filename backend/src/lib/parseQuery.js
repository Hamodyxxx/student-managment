
export function parseQuery(query) {
  const filter = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      if (typeof value === "string" && value.includes(",")) {
        filter[key] = { in: value.split(",") };
      } else if (value === "true" || value === "false") {
        filter[key] = value === "true";
      } else {
        filter[key] = value;
      }
    }
  }

  delete filter.skip;
  delete filter.limit;
  delete filter.orderBy;

  const skip = query.skip !== undefined ? parseInt(query.skip, 10) : undefined;
  const limit = query.limit !== undefined ? parseInt(query.limit, 10) : undefined
  const orderBy = typeof query.orderBy === "string" ? (() => { const [field, direction] = query.orderBy.split(":"); return field ? { [field]: direction === "desc" ? "desc" : "asc" } : undefined })() : undefined;

  return {
    filter,
    skip,
    limit,
    orderBy
  };
}
