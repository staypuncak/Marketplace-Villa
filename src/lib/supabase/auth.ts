import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let { data: admin } = await supabase
    .from('admins')
    .select('id, name, role')
    .eq('auth_uid', user.id)
    .single()

  if (!admin && user.email) {
    const { data: emailAdmin } = await supabase
      .from('admins')
      .select('id, name, role')
      .eq('email', user.email)
      .single()

    if (emailAdmin) {
      await supabase
        .from('admins')
        .update({ auth_uid: user.id })
        .eq('id', emailAdmin.id)

      admin = emailAdmin
    }
  }

  if (!admin) {
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }

  return { user, admin }
}
