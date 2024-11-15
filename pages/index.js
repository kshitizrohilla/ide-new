import Link from 'next/link';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">
      
      <div className="flex flex-col text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent leading-normal">Create in the Cloud</h1>
        <p className="text-sm w-3/5 mb-4 mx-auto font-medium text-white">Intelligent software development and deployment platform for crafting, collaborating, and launching exceptional software</p>
      </div>

      <div className="flex gap-2">
        <Link className="hover:text-pink-400 transition bg-slate-600 font-medium rounded-md px-4 py-2 text-white" href="/auth/signup">Get started for free</Link>
        <Link className="hover:text-indigo-600 transition bg-slate-200 rounded-md font-medium px-4 py-2 text-black" href="/dashboard">Take me to dashboard</Link>
      </div>
      
    </div>
  );
};