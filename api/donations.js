import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";

// Function to fetch donations for a specific donor using donorId
export const fetchDonationsForDonor = async () => {
  const { session } = useAuth();
  const id=session.user.id;

  try {
    if (!id) {
      throw new Error('No donor ID provided1');
    }

    
    const { data, error } = await supabase
      .from('donor_donations')
      .select('date,no_of_bottles,camp_id')
      .eq('donor_id', id); // Filt

    if (error) {
    
      throw error;
    }
  
    return data; // Return the donation data along with the camp location
  } catch (error) {
    console.error('Error fetching donations2:', error.message);
    throw error;
  }
};
