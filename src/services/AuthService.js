import { supabase } from "../supabaseClient";

export const isAdmin = async () => {
  return true;

  /*   try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) return false;

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !data) return false;
    
    return data.role === 'admin';
  } catch (error) {
    console.error("Error verificando rol de admin:", error);
    return false;
  } */
};
