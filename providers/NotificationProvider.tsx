import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '@/components/push';
import { ExpoPushToken } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<String | undefined>();

  const { session } = useAuth();

  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);
    if (!newToken) {
      return;
    }
    console.warn(newToken)
    // update the token in the database
    await supabase
      .from('profiles')
      .upsert({id:session?.user?.id, expo_push_token:newToken });
      
  };

  useEffect(() => {
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
  }, []);

  console.log('Push token: ', expoPushToken);
  console.log('Notif: ', notification);

  return <>{children}</>;
};

export default NotificationProvider;