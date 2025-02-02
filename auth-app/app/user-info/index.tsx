'use client'

import LogoutButton from "../logout-button"

export default function UserInfo({ email }: { email: string }) {
  return (
    <div>
      {email}
      <LogoutButton />
    </div>
  )
}