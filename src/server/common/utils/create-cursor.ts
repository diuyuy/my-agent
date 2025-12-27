export const createCursor = (value: string) => {
  if (!value) return null;

  const cursor = Buffer.from(value, "utf-8").toString("base64");

  return cursor;
};
