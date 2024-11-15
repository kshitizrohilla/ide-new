import Link from 'next/link';
import Image from 'next/image';
import { getSession, signIn } from 'next-auth/react';
import React, { useState } from 'react';
import axios from 'axios';

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

export default function signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/signup', { name, email, password, authType: 'credentials' });
    
    if (response.data === 'Registered successfully') {
      window.location.href = '/auth/signin';
    } else {
      setError(response.data);
    }
  };

  const handleGoogleSignin = async () => {
    await signIn('google');
  };

  const handleGithubSignin = async () => {
    await signIn('github');
  };
    
  return (
    <div className="bg-gradient-to-b from-slate-800 to-black flex items-center justify-center h-screen flex-col">

      <form onSubmit={handleSignup} className="flex items-center justify-center flex-col gap-2 w-80">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text leading-normal text-transparent">Sign up</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input onChange={(e) => setName(e.target.value)} className="text-white p-2 bg-slate-600 m-auto rounded-md w-full font-medium" type="text" placeholder="Name" />
        <input onChange={(e) => setEmail(e.target.value)} className="text-white p-2 bg-slate-600 m-auto rounded-md w-full font-medium" type="email" placeholder="Email" /> 
        <input onChange={(e) => setPassword(e.target.value)}className="text-white p-2 bg-slate-600 m-auto rounded-md w-full font-medium" type="password" placeholder="Password" />
        <button className="text-black bg-slate-200 rounded-md font-medium w-full px-4 py-2 mb-4" type="submit">Sign up</button>
      </form>

      <p className="text-white mb-4">Already a user? <Link className="text-blue-200" href="/auth/signin">Sign in</Link></p>

      <div className="flex items-center justify-center flex-col gap-2 w-60">
        <button onClick={handleGoogleSignin} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-md w-full">
          <Image alt="Continue with Google" className="w-6" src="/auth-icons/google.png" width={1000} height={1000}/>
          Continue with Google
        </button>

        <button onClick={handleGithubSignin} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-md w-full">
          <Image alt="Continue with GitHub" className="w-6" src="/auth-icons/github.png" width={1000} height={1000}/>
          Continue with GitHub
        </button>
      </div>

    </div>
  );
};