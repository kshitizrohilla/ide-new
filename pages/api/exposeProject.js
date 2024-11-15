import Docker from 'dockerode';
const docker = new Docker();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { containerName } = req.body;
    const container = docker.getContainer(containerName);

    const exec = await container.exec({
      Cmd: ['cloudflared', 'tunnel', '--url', 'http://localhost:80'],
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start();
    
    let output = '';
    let error = '';

    stream.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      output += chunkStr;
      console.log(chunkStr);
      
      if (chunkStr.includes('.trycloudflare.com')) {
        const urlMatch = chunkStr.match(/https:\/\/\S*\.trycloudflare\.com/);
        if (urlMatch) {
          return res.status(200).json({ success: true, url: urlMatch[0] });
        }
      }
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      error += err.toString();
    });

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const execInspect = await exec.inspect();

    return res.status(200).json({
      success: execInspect.ExitCode === 0,
      output,
      error: error || null,
      exitCode: execInspect.ExitCode
    });
  } catch (error) {
    console.error('Execution error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};