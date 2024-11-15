const Docker = require('dockerode');
const docker = new Docker();
import User from '@/models/User';
import connectDB from '@/lib/connectDB';

const checkContainerStatus = async (req, res) => {
  if (req.method !== 'POST') {
    return res.json({ message: 'Method not allowed' });
  }

  await connectDB();
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  try {
    const container = await docker.getContainer(user.projectName);
    const containerInfo = await container.inspect();
    const status = containerInfo.State.Status;
    return res.json({ status });
  } catch (error) {
    return res.json({ message: 'Cannot check status of container', error });
  }
};

export default checkContainerStatus;