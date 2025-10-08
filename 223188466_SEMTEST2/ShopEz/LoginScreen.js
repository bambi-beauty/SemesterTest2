import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email);
      } else {
        console.log("No user logged in");
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Products");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ShopEZ</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>
          Don't have an account? <Text style={styles.registerBold}>Register here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 30,
    backgroundColor: "#f8f9fa"
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50"
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#7f8c8d"
  },
  input: { 
    width: "100%", 
    height: 50, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3498db",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  registerLink: {
    marginBottom: 20
  },
  registerText: {
    color: "#7f8c8d",
    fontSize: 16
  },
  registerBold: {
    color: "#3498db",
    fontWeight: "bold"
  }
});