import { useState, useEffect } from 'react'
import { useMutation, useReactiveVar } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { SIGN_IN_MUTATION } from '../queries/queries'
import { isSignInVar, userVar } from '../global'

const SignIn = () => {
  const [email, setEmail] = useState<string>('taro@example.com')
  const [password, setPassword] = useState<string>('password')
  const isSignIn = useReactiveVar(isSignInVar)
  const navigate = useNavigate()

  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    variables: {
      email: email,
      password: password,
    },
    onCompleted: (data) => {
      console.log(data)
      if (data.signIn.isSuccess) {
        console.log('success:', data.signIn.nickname)
        isSignInVar(true)

        userVar({ nickname: data.signIn.nickname })
      }
    },
  })

  useEffect(() => {
    console.log('isSignIn:', isSignIn)
    if (isSignIn) {
      navigate('/')
    }
  }, [isSignIn, navigate])

  return (
    <div className="flex flex-col my-4 justify-center items-center w-screen h-[80-vh]">
      <div>
        <div className="justify-start">
          <label className="mr-2">
            Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <input
            className="h-8 px-2"
            type="text"
            value={email}
            onChange={(e) =>
              setEmail((_prev: string) => (_prev = e.target.value))
            }
          />
        </div>
        <div className="items-start my-2">
          <label className="mr-2">Password</label>
          <input
            className="h-8 px-2"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword((_prev: string) => (_prev = e.target.value))
            }
          />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault()
          signIn()
        }}
        className="text-2xl"
        data-testid="signin"
      >
        SignIn
      </button>
      <div onClick={() => navigate('/signup')} data-testid="change-to-signup">
        SignUp?
      </div>
    </div>
  )
}

export default SignIn
