import { useAuth } from "../../providers/AuthProvider";
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuth();

  // Return based on session state
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack />;
}
