export const QUERY_KEYS = {
  getConversationQueryKeys: (extraKey?: "history" | "favorites") =>
    extraKey ? ["conversations", extraKey] : ["conversations"],
  getRagQueryKeys: () => {
    return ["rags"];
  },
};
