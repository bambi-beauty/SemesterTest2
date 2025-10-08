import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Success", "Account created!");
        navigation.navigate("Login"); 
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join ShopEZ today</Text>
      
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
      
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Create Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.loginLink} 
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginBold}>Sign in</Text>
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
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#45a9e7ff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  loginLink: {
    marginBottom: 20
  },
  loginText: {
    color: "#7f8c8d",
    fontSize: 16
  },
  loginBold: {
    color: "#3498db",
    fontWeight: "bold"
  }
});