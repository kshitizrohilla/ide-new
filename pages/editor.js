import React, { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import axios from 'axios';

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

const Editor = ({ session }) => {
  const [url, setUrl] = useState('');
  const loadRef = useRef(false);

  useEffect(() => {
    if (!loadRef.current) {
      loadRef.current = true;

      const fetchURL = async () => {
        const response = await axios.post('/api/fetchProject', { email: session.user.email });
        console.log(`Fetch project: ${response.data.projectURL}`);
        setTimeout(() => setUrl(response.data.projectURL), 5000);
      };

      const wakeProject = async () => {
        const response = await axios.post('/api/wakeProject', { email: session.user.email });
        console.log(response.data.status);

        if (response.data.status === 'Container already running') {
          fetchURL();
        } else {
          const updateAgain = await axios.post('/api/updateProjectURL', { email: session.user.email, projectURL: response.data.url });
          console.log(updateAgain);
          fetchURL();
        }
      };

      wakeProject();
    }
  }, []);

  return (
    <div>
      {url ? (
        <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">
          <iframe className="absolute w-full h-full" src={url} />
        </div>
        ) : (
        <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">
          <div className="w-10 h-10 mb-2 border-4 border-dashed rounded-full animate-spin dark:border-indigo-400"></div>
          <h1 className="text-xl flex align-center justify-center text-white">Loading Editor</h1>
        </div>)}
    </div>
  );
};

export default Editor;