// TODO: モーダルにする
const SignOut = ({ signOut }: any) => {
  return (
    <div className="my-4 flex justify-center">
      <button
        onClick={(e) => {
          e.preventDefault()
          signOut()
        }}
        className="text-2xl"
      >
        SignOut
      </button>
    </div>
  )
}

export default SignOut
