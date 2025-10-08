import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import { ref, get, set, onValue } from "firebase/database";
import { db, auth } from "./firebase";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [cartCount, setCartCount] = useState(0);

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

  const addToCart = async (product) => {
    if (!auth.currentUser) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    const userId = auth.currentUser.uid;
    const cartRef = ref(db, `carts/${userId}/${product.id}`);

    try {
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        const currentQuantity = snapshot.val().quantity || 1;
        set(cartRef, { ...product, quantity: currentQuantity + 1 });
      } else {
        set(cartRef, { ...product, quantity: 1 });
      }
      alert("Product added to cart!");
    } catch (error) {
      console.log(error);
      alert("Could not add product to cart.");
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={28} color="black" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartCount]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Button title="Add to Cart" onPress={() => addToCart(product)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8"
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  price: {
    fontSize: 18,
    color: "#000000ff",
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20
  },
  cartIcon: {
    marginRight: 15,
    padding: 5
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold"
  }
});