export const CACHE_TAG = {
  getFavoriteCacheTag: (userId: string) => `${userId}-favorites`,
  getHistoryCacheTag: (userId: string) => `${userId}-history`,
};
