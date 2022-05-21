import React from 'react'

const SignIn = ({ email, setEmail, password, setPassword, signIn }: any) => {
  return (
    <div className="flex flex-col my-4 items-center">
      <div>
        <div className="justify-start">
          <label className="mr-2">
            Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <input
            className="h-8 px-2"
            type="text"
            value={email}
            onChange={(e) => setEmail((_prev: any) => (_prev = e.target.value))}
          />
        </div>
        <div className="items-start my-2">
          <label className="mr-2">Password</label>
          <input
            className="h-8 px-2"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword((_prev: any) => (_prev = e.target.value))
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
      >
        SignIn
      </button>
    </div>
  )
}

export default SignIn
