import Image from 'next/image';
import axios from 'axios';
import React, { useState } from 'react';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
};

const NewJava = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');

  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);

  const handleCreateProject = async () => {
    setFirst(true);

    const response = await axios.post('/api/createProject', {
      containerName: workspaceName,
      image: 'java',
      email: session.user.email
    });

    if (response.data.message !== 'OK') {
      setError(response.data.message);
      console.log(response);
    } else {
      setError('');
      setLoading(true);
      console.log(response);
      setSecond(true);
      const expose = await axios.post('/api/exposeProject', { containerName: response.data.containerName });
      console.log(expose);
      
      const updateURL = await axios.post('/api/updateProjectURL', { email: session.user.email, projectURL: expose.data.url });

      setThird(true);
      console.log(updateURL);
      window.location.href = '/editor';
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">
      <Image alt="Java Logo" className="mb-2" src="https://www.gstatic.com/monospace/240624/logo_java.svg" width={50} height={50} />
      <h1 className="text-white font-medium text-xl mb-2">Create new Java workspace</h1>
      <input onChange={(e) => setWorkspaceName(e.target.value)} disabled={loading} className="mb-2 bg-slate-600 p-2 rounded-md text-white" type="text" placeholder="Name your workspace" />
      <button disabled={loading} className="text-white text-white text-sm bg-slate-600 hover:bg-slate-800 transition rounded-md px-4 py-2 mb-2" onClick={handleCreateProject}>Create</button>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {first && (<p className="text-white">Creating workspace</p>)}
      {second && (<p className="text-white">Setting up workspace</p>)}
      {third && (<p className="text-white">Finalizing</p>)}
    </div>
  );
};

export default NewJava;