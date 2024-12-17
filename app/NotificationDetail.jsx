import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

import { supabase } from "../lib/supabase";
import { images } from "../constants";
import { useAuth } from "../providers/AuthProvider";

export default function NotificationDetail({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
     
      if (!profile?.blood_type) {
        Alert.alert("Error", "Blood type not available for this profile.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, status, blood_type, user_id")
          .eq("blood_type", profile.blood_type);

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }

      setLoading(false);
    };

    // Fetch notifications initially
    fetchNotifications();

    // Cleanup function to prevent memory leaks
    return () => {
      setNotifications([]);
    };
  }, [profile]);

  const handleAction = async (notification, action) => {
    const newStatus = action === "accept" ? "Accepted" : "Declined";

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: newStatus })
        .eq("id", notification.id);

      if (error) {
        Alert.alert("Error", "Failed to update status. Please try again.");
        console.error("Error updating status:", error);
      } else {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, status: newStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#ffecec",
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image
          source={images.notific}
          style={{ maxWidth: 380, width: "100%", height: 180 }}
          resizeMode="contain"
        />

      

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationBox}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={images.profile}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.notificationTitle}>
                    {item.blood_type}
                  </Text>
                  <Text style={styles.notificationName}>
                    {profile?.f_name || "Unknown"}
                  </Text>
                </View>
              </View>
              <Text> </Text>
              {item.status === "pending" ? (
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAction(item, "accept")}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.declineButton]}
                    onPress={() => handleAction(item, "decline")}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </Pressable>
                </View>
              ) : (
                <Text
                  style={[
                    styles.statusText,
                    item.status === "Accepted" && styles.acceptedStatus,
                    item.status === "Declined" && styles.declinedStatus,
                  ]}
                >
                  {item.status}
                </Text>

              )}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notificationBox: {
    backgroundColor: "#add8e6",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "stretch", 
  },
  
  profileImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  notificationTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  notificationName: {
    fontSize: 20,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
},
button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
},

  acceptButton: {
    backgroundColor: "#4CAF50", 
  },
  declineButton: {
    backgroundColor: "#F44336", 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: -5,
    textAlign: "center",
  },
  acceptedStatus: {
    color: "#4CAF50", 
  },
  
  declinedStatus: {
    color: "#F44336", 
  },
  
});
