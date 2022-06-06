import { useRef, useEffect } from 'react'
import {
  isSignOutModsalOnVar,
  booksVar,
  userVar,
  isSignInVar,
} from '../../global/index'
import { useMutation } from '@apollo/client'
import { SIGN_OUT_MUTATION } from '../../queries/queries'

// Memo: MessageModalと違い@headlessui/reactを使っていない（react v18で謎の挙動で上手く動作していないため）

const SignOutModal = () => {
  const ref = useRef<HTMLButtonElement>(null!)
  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    onCompleted: () => {
      // TODO: SignOutした際にMutationで取得したデータの初期化をやめるか、やり方を変える
      booksVar([])
      userVar({ nickname: '' })
      isSignInVar(false)
    },
  })

  // MEMO: Cancelボタンにフォーカス
  useEffect(() => {
    ref.current.focus()
  }, [])

  // TODO: デザイン
  return (
    <>
      <div
        onClick={() => isSignOutModsalOnVar(false)}
        className="absolute inset-0 bg-black opacity-50"
      />
      <div className="absolute bottom-[10%] left-1/3 px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div
          onClick={() => isSignOutModsalOnVar(false)}
          className="bg-black opacity-0 w-full h-full absolute z-10 inset-0"
        />
        <div className="bg-gray-100 rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
          <div className="md:flex flex-col items-start w-96 h-36">
            <div className="mt-4 md:mt-0 md:mx-6 text-center md:text-left w-screen">
              <p className="font-bold text-2xl text-gray-900">SignOut</p>
            </div>
          </div>
          <div
            onKeyDown={(e) => console.log('hoge')}
            className="text-center md:text-right mt-4 md:flex md:justify-end"
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                signOut()
                isSignOutModsalOnVar(false)
              }}
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 hover:bg-gray-400 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
              data-testid="card-modal-update-button"
            >
              SignOut
            </button>
            <button
              onClick={() => isSignOutModsalOnVar(false)}
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 hover:bg-gray-400 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1 focus:shadow-outline focus:border-gray-400"
              data-testid="card-modal-close-button"
              ref={ref}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignOutModal
