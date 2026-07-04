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

  if (admin) {
    return { user, admin }
  }

  if (user.email) {
    const { data: rpcResult } = await supabase.rpc('check_admin_by_email', {
      user_email: user.email,
    })

    if (rpcResult && Array.isArray(rpcResult) && rpcResult.length > 0) {
      const row = rpcResult[0] as { admin_id: string; admin_name: string; admin_role: string }

      await supabase.rpc('link_admin_auth', {
        admin_id: row.admin_id,
        auth_user_id: user.id,
      })

      return {
        user,
        admin: { id: row.admin_id, name: row.admin_name, role: row.admin_role },
      }
    }
  }

  await supabase.auth.signOut()
  redirect('/login?error=unauthorized')
}
