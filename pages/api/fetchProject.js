import User from '@/models/User';
import connectDB from '@/lib/connectDB';

export default async function fetchProject(req, res) {
  if (req.method === 'POST') {
    await connectDB();

    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (user.projectName !== null) {
      return res.json({ message: 'Project found', projectName: user.projectName, projectURL: user.projectURL });
    } else {
      return res.json({ message: 'No project found' });
    }
  }
};