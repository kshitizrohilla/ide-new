import Link from 'next/link';
import Image from 'next/image';
import { getSession, signIn } from 'next-auth/react';
import React, { useState } from 'react';

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

export default function signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (!response.error) {
      window.location.href = '/dashboard';
    } else {
      if (response.error === 'Illegal arguments: string, undefined') {
        setError('You previously used Google or GitHub to sign in. Please continue with Google or GitHub.');
      } else {
        setError(response.error);
      }
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

      <form onSubmit={handleSignin} className="flex items-center justify-center flex-col gap-2 w-80">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text leading-normal text-transparent">Sign in</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input onChange={(e) => setEmail(e.target.value)} className="text-white p-2 bg-slate-600 m-auto rounded-md w-full font-medium" type="text" placeholder="Email" /> 
        <input onChange={(e) => setPassword(e.target.value)} className="text-white p-2 bg-slate-600 m-auto rounded-md w-full font-medium" type="password" placeholder="Password" />
        <button className="text-black bg-slate-200 rounded-md font-medium w-full px-4 py-2 mb-4" type="submit">Sign in</button>
      </form>

      <p className="text-white mb-4">New user? <Link className="text-blue-200" href="/auth/signup">Sign up</Link></p>

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