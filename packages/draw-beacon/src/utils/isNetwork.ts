export const isMainnet = (chainId: number): boolean => {
  switch (chainId) {
    case 1:
      return true;
    default:
      return false;
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case 5:
      return true;
    default:
      return false;
  }
};
