import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';

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

export default function Dashboard({ session }) {
  const [project, setProject] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const handleSignout = async () => {
    const response = await signOut({ redirect: true, callbackUrl: "/" });
    console.log(response);
  };

  const handleCreateProjectTemplate = async (template) => {
    window.location.href = `/new/${template}`;
  };

  const handleDeleteProject = async () => {
    const response = await axios.post("/api/deleteProject", {
      projectName: project,
    });

    console.log(response);

    if (response.data.message === "Container deleted successfully") {
      setProject(null);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const response = await axios.post("/api/fetchProject", {
        email: session.user.email,
      });

      if (response.data.projectName) {
        console.log(response.data.projectName);
      }

      if (response.data.message === 'Project found') {
        setProject(response.data.projectName);
      }

      setShowLoader(false);
    };

    fetchProject();
  }, [project]);

  return (
    <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent leading-normal">Dashboard</h1>
      <p className="text-white mb-4">Welcome back, { session.user.name }</p>

      <p className="text-indigo-400 mb-2">Featured web app templates</p>

      <div className="flex flex-row gap-4 bg-slate-800 rounded-md h-fit p-4 text-slate-400 mb-4">
        <div onClick={() => { handleCreateProjectTemplate('express') }} className="cursor-pointer hover:bg-slate-900 transition flex flex-col text-xs bg-slate-950 border border-slate-600 rounded-md p-6 w-48 h-48">
          <Image alt="Template image" className="mb-2" src="https://www.gstatic.com/monospace/231115/logo_nodejs.svg" width={40} height={40} />
          <h1 className="text-sm mb-2 font-medium text-blue-400">Node Express</h1>
          <p className="text-xs">Build the backend or a service using Express.js in Node</p>
        </div>

        <div onClick={() => { handleCreateProjectTemplate('python') }} className="cursor-pointer hover:bg-slate-900 transition flex flex-col text-xs bg-slate-950 border border-slate-600 rounded-md p-6 w-48 h-48">
          <Image alt="Template image" className="mb-2" src="https://www.gstatic.com/monospace/231115/logo_python.svg" width={40} height={40} />
          <h1 className="text-sm mb-2 font-medium text-blue-400">Python</h1>
          <p className="text-xs">Python is a high-level, general-purpose programming language.</p>
        </div>

        <div onClick={() => { handleCreateProjectTemplate('java') }} className="cursor-pointer hover:bg-slate-900 transition flex flex-col text-xs bg-slate-950 border border-slate-600 rounded-md p-6 w-48 h-48">
          <Image alt="Template image" className="mb-2" src="https://www.gstatic.com/monospace/240624/logo_java.svg" width={40} height={40} />
          <h1 className="text-sm mb-2 font-medium text-blue-400">Java</h1>
          <p className="text-xs">Build an API server with Spring and Java</p>
        </div>

        <div onClick={() => { handleCreateProjectTemplate('cpp') }} className="cursor-pointer hover:bg-slate-900 transition flex flex-col text-xs bg-slate-950 border border-slate-600 rounded-md p-6 w-48 h-48">
          <Image alt="Template image" className="mb-2" src="https://www.gstatic.com/monospace/240624/logo_cpp.svg" width={40} height={40} />
          <h1 className="text-sm mb-2 font-medium text-blue-400">C++</h1>
          <p className="text-xs">Build an API server with C++</p>
        </div>
      </div>

      <p className="text-indigo-400 mb-2">Your workspaces</p>

      {showLoader && (<div className="w-10 h-10 mt-2 mb-4 border-4 border-dashed rounded-full animate-spin dark:border-indigo-400"></div>)}

      {project && (
        <div className="flex flex-col bg-slate-800 rounded-md h-fit p-4 text-slate-400 mb-4 items-center">
          <div className="flex flex-row bg-slate-950 border border-slate-600 rounded-md items-center">
            <div className="flex flex-row align-center p-4 pl-8">
              <Image alt="Template image" src="/project.svg" width={30} height={30} />
            </div>

            <div className="flex flex-col align-center p-4">
              <h1 className="text-blue-400 font-medium text-sm"><Link href='/editor'>{project}</Link></h1>
              <p className="text-xs">Project info...</p>
            </div>

            <div className="flex flex-col align-center p-4">
              <p className="text-indigo-400 text-xs">Ram: 0.00 MB</p>
              <p className="text-indigo-400 text-xs">Storage: 1.00 GB</p>
            </div>

            <div className="flex align-center p-4 pr-8">
              <button className="rounded-md" onClick={handleDeleteProject}>✖</button>
            </div>
          </div>
        </div>
      )}

      {(!project && !showLoader) && (<p className="text-white mb-2">You have not created any projects yet</p>)}

      <button className="hover:bg-slate-800 transition bg-slate-600 font-medium rounded-md px-4 py-2 text-white" onClick={handleSignout}>Sign out</button>
    </div>
  );
};