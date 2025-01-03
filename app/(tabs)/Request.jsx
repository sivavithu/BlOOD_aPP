import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

const profile = require("../../assets/images/pic.png");
const logout = require("../../assets/icons/logout.png");

const Request = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false); // Track logout process

  useEffect(() => {
    // func sessions
    const fetchSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error || !session?.user) {
          router.replace("/(auth)/sign-in");
        } else {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Unexpected error fetching session:", err.message);
        router.replace("/(auth)/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true); // Start logout process
    // console.log("Starting SignOut: ", session);//Debugging
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        setLoggingOut(false); // Stop logout process on error
      } else {
        setUser(null); // Clear user state
        router.replace("/(auth)/sign-in");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err.message);
      setLoggingOut(false); // Stop logout process on error
    }
  };

  // Block rendering while loading session or logging out
  if (loading || loggingOut) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FD0000" />
      </View>
    );
  }

  if (!user) {
    return null; // Avoid rendering when user is null
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#FD0000"]}
        style={styles.linearGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topSection}>
            <View style={styles.propicArea}>
              <Image source={profile} style={styles.propic} />
            </View>
            <Text style={styles.name}>{user?.email || "Guest"}</Text>
          </View>

          <View style={styles.buttonList}>
            <Pressable
              style={styles.buttonSection}
              onPress={handleLogout}
              accessible={true}
              accessibilityLabel="Log out of the application"
            >
              <View style={styles.buttonArea}>
                <View style={styles.iconArea}>
                  <Image
                    source={logout}
                    style={styles.iconStyle}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.buttonName}>Logout</Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  safeArea: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  topSection: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
  },
  propicArea: {
    width: 170,
    height: 170,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#FFBB3B",
  },
  propic: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: 20,
    color: "black",
    fontSize: 32,
  },
  buttonList: {
    marginTop: 5,
  },
  buttonSection: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconArea: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  buttonName: {
    width: 300,
    fontSize: 20,
    color: "black",
    marginLeft: 20,
  },
});
