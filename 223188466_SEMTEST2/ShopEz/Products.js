import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { ref, onValue } from "firebase/database";
import { db, auth } from "./firebase";

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Menu",
                "Choose an option",
                [
                  { text: "Cart", onPress: () => navigation.navigate("Cart") },
                  { 
                    text: "Logout", 
                    onPress: () => {
                      auth.signOut();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                      });
                    } 
                  },
                  { text: "Cancel", style: "cancel" }
                ],
                { cancelable: true }
              );
            }}
          >
            <Text style={{ fontSize: 28 }}>☰</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const cartRef = ref(db, `carts/${userId}`);

    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {};
      const totalQuantity = Object.values(data).reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(totalQuantity);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center"
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
    fontSize: 16
  },
  listContent: {
    paddingBottom: 10
  },
  card: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    marginBottom: 12, 
    borderRadius: 10, 
    padding: 12, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  image: { 
    width: 70, 
    height: 70, 
    resizeMode: "contain", 
    marginRight: 12,
    borderRadius: 6
  },
  info: { 
    flex: 1 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 4,
    color: "#000000ff"
  },
  price: { 
    fontSize: 16, 
    color: "#000000ff",
    fontWeight: "600",
    marginBottom: 2
  },
  category: {
    fontSize: 12,
    color: "#7f8c8d",
    textTransform: "capitalize"
  }
});