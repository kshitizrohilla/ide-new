const Docker = require('dockerode');
const docker = new Docker();

import User from '@/models/User';
import connectDB from '@/lib/connectDB';

export default async function wakeProject(req, res) {
  if (req.method !== 'POST') {
    return res.json({ message: 'Method not allowed' });
  }
  
  await connectDB();
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user.projectName !== null && user.projectURL !== null) {
    try {
      const container = await docker.getContainer(user.projectName);
      const containerInfo = await container.inspect();
      const status = containerInfo.State.Status;
      console.log(status);

      if (status === 'exited') {
        await container.start();

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
              return res.status(200).json({ success: true, url: urlMatch[0], status });
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
          message: 'Container started successfully',
          output,
          status,
          error: error || null,
          exitCode: execInspect.ExitCode
        });
      } else {
        res.json({ message: 'Container already running' });
      }
    } catch (error) {
      return res.json({ error });
    }
  }

  return res.json({ message: 'Either the user has not created any projects or it is not hosted properly' });
};