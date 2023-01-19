export const CopyToClipboard = async (data: string): Promise<void> => {
  return navigator.clipboard.writeText(data);
};
