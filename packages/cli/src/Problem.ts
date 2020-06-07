class Problem {
	constructor(readonly paths: string[]) {}

	scanSrcFolder(packageJson, path: string) {
		const splittedFullPath = path.split('/');
    const dirName = splittedFullPath.pop();
    const fullpathWithoutFilename = splittedFullPath.join('/');
    
	}
}
