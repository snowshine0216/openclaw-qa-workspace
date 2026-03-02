export default async function getRelativePath(fileName) {
    const workspacePath = process.cwd();
    return `${workspacePath}/resources/${fileName}`;
}