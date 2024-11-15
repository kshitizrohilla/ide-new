const Docker = require('dockerode');
const docker = new Docker();

import User from '@/models/User';
import connectDB from '@/lib/connectDB';

export default async function createProject(req, res) {
  if (req.method === 'POST') {
    let { containerName, image, email } = req.body;

    containerName = containerName.toLowerCase().replace(/\s+/g, '');
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(containerName);
    if (!isValid) return res.json({ message: 'Project name can only contain letters and digits' });

    await connectDB();

    const user = await User.findOne({
      email: email
    });

    const existingProject = await User.findOne({
      projectName: containerName
    });

    if (existingProject) {
      return res.json({ message: 'Project name already taken' });
    } else if (user.projectName !== null) {
      return res.json({ message: 'You can only create one project in free tier' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { projectName: containerName },
      { new: true }
    );

    try {
      const container = await docker.createContainer({
        name: containerName,
        Image: image,
        Tty: true,
      });

      await container.start();
      const containerIP = (await container.inspect()).NetworkSettings.Networks['bridge'].IPAddress;
      return res.json({ message: 'OK', containerName, image, containerIP });

    } catch (err) {
      return res.json({
        message: 'Failed to create project',
        err: err,
        containerName,
        image
      });
    }
  }
};