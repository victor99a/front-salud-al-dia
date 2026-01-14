import { supabase } from '../supabaseClient';

export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, rut, first_names, last_names, email, role, created_at, status, delete_requested_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error en getUsers:", error.message);
    return [];
  }
};

export const resetUserPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error en resetUserPassword:", error.message);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error en deleteUser:", error.message);
    return { success: false, error: error.message };
  }
};