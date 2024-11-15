const Docker = require('dockerode');
const docker = new Docker();

import User from '@/models/User';
import connectDB from '@/lib/connectDB';

export default async function deleteProject(req, res) {
  if (req.method === 'POST') {
    const { projectName } = req.body;
    const container = await docker.getContainer(projectName);

    await connectDB();

    const checkExisting = await User.findOne({ projectName: projectName });
    console.log(checkExisting);

    if (checkExisting.projectName !== null) {
      const updatedUser = await User.findOneAndUpdate(
        { projectName: projectName },
        { projectName: null, projectURL: null },
        { new: true }
      );
    }

    await container.remove({ force: true }, (error, data) => {
      if (error) {
        return res.json({ error });
      } else {
        return res.json({ message: 'Container deleted successfully', data: data });
      }
    });
  }
};
