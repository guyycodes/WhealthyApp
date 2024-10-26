// app/(auth)/callback.jsx
import React, {useEffect} from 'react';
import { SignInForm } from 'app/screens/Login/UserLogin';
import { useSequencer } from 'app/Context/Controller';


export default function CallbackSection() {

  return (
    <SignInForm NeedsNewAccount={true} />
  );
}