export const maskHeaders = (headers: any) => {
    const h = { ...headers };
    if (h.authorization) h.authorization = "***";
    if (h.cookie) h.cookie = "***";
    return h;
  };