import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '@/components/push';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const { profile } = useAuth();
  const [profileReady, setProfileReady] = useState(false);

  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const savePushToken = async (newToken: string | undefined) => {
    if (!profileReady) {
      console.warn('Profile is not ready yet. Skipping token save.');
      return;
    }

    setExpoPushToken(newToken);

    if (!newToken) {
      Alert.alert('Error', 'No token provided');
      return;
    }

    if (!profile?.id) {
      Alert.alert('Error', 'Profile ID is missing');
      return;
    }

    console.warn('Push Token', `Push token before upsert: ${newToken}`);

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: profile.id, expo_push_token: newToken })
      .select();

    if (error) {
      console.warn('Upsert Failed', `Failed to upsert push token: ${error.message}`);
      console.error('Failed to upsert push token:', error);
    } else {
      const updatedToken = data?.[0]?.expo_push_token;
      console.warn('Upsert Success', `Push token after upsert: ${updatedToken}`);
      console.log('Push token saved successfully:', data);
    }
  };

  // Ensure `profile` is ready before performing actions
  useEffect(() => {
    if (profile) {
      setProfileReady(true);
    }
  }, [profile]);

  // Subscribe to real-time changes in the `profiles` table
  useEffect(() => {
    if (!profileReady) {
      return;
    }

    const subscription = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime update received:', payload);

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedRow = payload.new;
            console.log('Updated row:', updatedRow);

            if (updatedRow.id === profile?.id) {
              console.log('Push token updated for current user:', updatedRow.expo_push_token);
              setExpoPushToken(updatedRow.expo_push_token);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileReady, profile?.id]);

  useEffect(() => {
    if (!profileReady) {
      return;
    }

    registerForPushNotificationsAsync().then((token) => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [profileReady]);

  return <>{children}</>;
};

export default NotificationProvider;
