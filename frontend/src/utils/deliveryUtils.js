export function deduplicateDeliveries(data) {
  const seen = new Map();
  data.forEach(item => {
    if (!seen.has(item.parcel_id) ||
        new Date(item.created_at) > new Date(seen.get(item.parcel_id).created_at)) {
      seen.set(item.parcel_id, item);
    }
  });
  return Array.from(seen.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}