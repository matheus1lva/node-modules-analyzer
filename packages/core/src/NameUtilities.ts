export const cleanupDirName = (fullPath: string) => {
  const splittedPath = fullPath.split('/');
  const rootPackage = splittedPath[splittedPath.length - 3];
  const packageName = splittedPath.pop();
  if (fullPath.includes('@') && !packageName.includes('@')) {
    let parentOfScopped = splittedPath[splittedPath.length - 2];
    if(parentOfScopped === 'node_modules') {
      parentOfScopped = splittedPath[splittedPath.length - 3];
    }
    // const scope = splittedPath[splittedPath.length - 1];
    const findScope = splittedPath.find((value) => value.includes("@"));
    return `${parentOfScopped}/${findScope}/${packageName}`;
  }

  return `${rootPackage}/${packageName}`;
};
