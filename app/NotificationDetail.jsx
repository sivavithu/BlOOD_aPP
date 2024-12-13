import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View, Pressable, StyleSheet, Image, ScrollView } from "react-native";
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
          .select("id, status, blood_type, user_id, profiles(f_name), title")
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
            item.id === notification.id ? { ...item, status: newStatus } : item
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
        alignItems: "center",
        padding: 25,
      }}
    >
      <View
        style={{
          backgroundColor: "#ffecec",
          padding: 25,
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

        <Text style={{ marginVertical: 10, fontSize: 18, fontWeight: "bold" }}>
          Notifications
        </Text>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#add8e6",
                padding: 10,
                borderRadius: 10,
                marginVertical: 5,
                width: "100%",
                maxWidth: 350,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={images.profile}
                  style={{ width: 40, height: 40, marginRight: 10 }}
                />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#000" }}>
                    {item.profiles?.f_name || "Unknown"}
                  </Text>
                </View>
              </View>
              {item.status === "pending" ? (
                <View style={{ flexDirection: "row" }}>
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
                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>
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
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50", // Green color
  },
  declineButton: {
    backgroundColor: "#F44336", // Red color
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
