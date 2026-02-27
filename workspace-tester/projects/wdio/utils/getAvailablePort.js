import getPort, { portNumbers } from 'get-port';

export default async function getAvailablePort() {
    const start = 9000 + Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 10);
    const end = start + 9;
    const port = await getPort({ port: portNumbers(start, end) });

    console.log(`get available port: ${port}`);
    return port;
}
