import { SignIn } from '@clerk/clerk-react'
import './signInPage.css'

const SignInPage = () => {
  return (
    <div className='signInPage'>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
    </div>
  )
}

export default SignInPage