import { supabase } from "../lib/supabase";// Adjust the path as needed

export const fetchActiveCamps = async () => {
  try {
    const { data, error } = await supabase
      .from('blood_camp') // Replace with your table name
      .select('*')
      .eq('status', 'active'); // Fetch only active camps

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch camps');
  }
};
