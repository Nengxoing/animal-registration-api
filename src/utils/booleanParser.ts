export const parseBooleanOrUndefined = (value: any): boolean | undefined => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
};

export const getStatusFilter = (status: any) => {
  if (status === "true") {
    return true;
  } else if (status === "false") {
    return false;
  }
  return undefined;
};
