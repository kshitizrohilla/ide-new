import User from '@/models/User';
import connectDB from '@/lib/connectDB';

export default async function updateProjectURL(req, res) {
  if (req.method !== 'POST') {
    return res.json({ message: 'Method not allowed' });
  }

  const { email, projectURL } = req.body;
  console.log('PROJECT URL:', projectURL);

  try {
    await connectDB();
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { projectURL: projectURL },
      { new: true }
    );

    console.log('UPDATED USER:', updatedUser);
    return res.json({ message: 'Project url updated successfully', updatedUser });
  } catch (error) {
    return res.json({ error });
  }
};