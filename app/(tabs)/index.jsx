import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Text, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";

const SignUp = () => {
  const [donations, setDonations] = useState(0);
  const [livesSaved, setLivesSaved] = useState(0);
  const [totalBlood, setTotalBlood] = useState(0); // in ml
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [nextDonationDate, setNextDonationDate] = useState(null);
  const [progress, setProgress] = useState(0); // Progress percentage
  const [hasNotifications, setHasNotifications] = useState(false); // Track notification availability
  const { session, profile } = useAuth();

  const fetchDonationData = async () => {
    try {
      // console.log("Fetching Data donor");// Debuging
      const { data: donationData, error: donationError } = await supabase
        .from("donor_donations")
        .select("no_of_bottles,date")
        .eq("donor_id", session.user.id)
        .order("date", { ascending: false });

      if (donationError) {
        Alert.alert("Error fetching donations", donationError.message);
        return;
      }
      // console.log("Fetching Data: ", donationData);// Debuging

      if (donationData && donationData.length > 0) {
        const totalBottles = donationData.reduce(
          (sum, donation) => sum + donation.no_of_bottles,
          0
        );
        setDonations(totalBottles);

        const totalBloodAmount = totalBottles * 200; // Each bottle is 200 ml
        setTotalBlood(totalBloodAmount);

        setLivesSaved(Math.floor(totalBloodAmount / 300)); // Each life saved is 300 ml

        const recentDonationDate = new Date(donationData[0].date);
        setLastDonationDate(recentDonationDate);

        const nextDate = new Date(recentDonationDate);
        nextDate.setDate(nextDate.getDate() + 100); // 100-day gap
        setNextDonationDate(nextDate);

        const today = new Date();
        const daysSinceLastDonation = Math.max(
          0,
          (today - recentDonationDate) / (1000 * 60 * 60 * 24)
        );
        const progressPercentage = Math.min(
          100,
          (daysSinceLastDonation / 100) * 100
        );
        setProgress(progressPercentage);
      } else {
        setDonations(0);
        setTotalBlood(0);
        setLivesSaved(0);
        setLastDonationDate(null);
        setNextDonationDate(null);
        setProgress(0);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        Alert.alert("Error fetching notifications", error.message);
        return;
      }

      setHasNotifications(notifications && notifications.length > 0);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const setupRealtime = () => {
    // Subscribe to 'donor_donations' changes
    const donationSubscription = supabase
      .channel("donor_donations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donor_donations" },
        (payload) => {
          // console.log("Donation change:", payload);
          fetchDonationData(); // Refetch donation data
        }
      )
      .subscribe();

    // Subscribe to 'notifications' changes
    const notificationSubscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          // console.log("Notification change:", payload);
          fetchNotifications(); // Refetch notifications
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationSubscription);
      supabase.removeChannel(notificationSubscription);
    };
  };

  useEffect(() => {
    if (!profile || !session) return;

    fetchDonationData();
    fetchNotifications();

    const cleanup = setupRealtime();
    return cleanup; // Cleanup subscriptions on unmount
  }, [profile, session]);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FD0000", "#FFFFFF", "#FD0000", "#FFFFFF"]}
      locations={[0.4, 0.8, 1, 0.2, 0.3]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View
            style={{ width: "100%", marginBottom: 24, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              <Text style={{ color: "#FD0000" }}>Blood KING</Text>
            </Text>
            <Image
              source={images.curve}
              style={{
                width: 350,
                height: 20,
                marginTop: 8,
              }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#111111",
              marginVertical: 16,
            }}
          >
            Welcome {profile?.f_name ?? "User"}
          </Text>
          <Image
            source={images.logo}
            style={{ width: "100%", height: 180, marginBottom: 24 }}
            resizeMode="contain"
          />

          <View
            style={{
              backgroundColor: "#ffecec",
              padding: 20,
              borderRadius: 20,
              width: "100%",
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {[
                { label: "lives saved", value: livesSaved },
                { label: "of blood", value: totalBlood + "ml" },
                { label: "donations", value: donations },
              ].map((stat, index) => (
                <View key={index} style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#ff0000",
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 16 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#ffecec",
              padding: 20,
              borderRadius: 20,
              width: "100%",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Blood Request
              </Text>
              <Pressable
                onPress={() => {
                  if (hasNotifications) {
                    router.push("/NotificationDetail");
                  } else {
                    Alert.alert(
                      "No Notifications",
                      "There are no notifications available."
                    );
                  }
                }}
              >
                <Ionicons name="chevron-forward" size={24} color="#000" />
              </Pressable>
            </View>

            <View style={{ alignItems: "left", marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: hasNotifications ? "#ff0000" : "#111111",
                  textAlign: "left",
                }}
              >
                {hasNotifications ? "Available" : "Not Available"}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              marginVertical: 20,
              padding: 20,
              borderRadius: 30,
              backgroundColor: "#ffecec",
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 20 }}>Next Donation</Text>

            {lastDonationDate ? (
              <>
                {nextDonationDate ? (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginVertical: 10,
                      }}
                    >
                      {nextDonationDate.toLocaleDateString()}
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 20,
                        backgroundColor: "#ddd",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          backgroundColor: "#ff0000",
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 16 }}>
                      {Math.max(
                        0,
                        Math.ceil(
                          (nextDonationDate - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginVertical: 10,
                    }}
                  >
                    No upcoming donation date available
                  </Text>
                )}
              </>
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginVertical: 10,
                }}
              >
                No donations provided
              </Text>
            )}
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#FFFFFF" style="dark" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;
