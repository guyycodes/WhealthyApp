// app/(login)/login.jsx
import React,{useEffect} from 'react';
import { SignInForm } from 'app/screens/Login/Signup';
import { useSequencer } from 'app/Context/Controller';


export default function CallbackSection() {

  const { getToken } = useSequencer();
  useEffect(() => {


}, []);
  return (
    <SignInForm NeedsNewAccount={true} />
  );
}