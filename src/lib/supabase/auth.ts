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

  const { data: admin } = await supabase
    .from('admins')
    .select('id, name, role')
    .eq('auth_uid', user.id)
    .single()

  if (!admin) {
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }

  return { user, admin }
}
