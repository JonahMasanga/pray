export function mergeRequestsWithFallback(firestoreRequests, fallbackRequests) {
  const byId = new Map();
  fallbackRequests.forEach((request) => {
    byId.set(String(request.id), { ...request, isFirestoreBacked: false });
  });
  firestoreRequests.forEach((request) => {
    byId.set(String(request.id), { ...request, isFirestoreBacked: true });
  });

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_date) - new Date(a.created_date)
  );
}
