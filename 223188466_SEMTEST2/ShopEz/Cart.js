import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { ref, onValue, set, remove } from "firebase/database";
import { db, auth } from "./firebase"; 
import { Ionicons } from "@expo/vector-icons";
import { saveCart, loadCart } from "./AsyncStorage";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const cartRef = ref(db, `carts/${userId}`);

    const unsubscribe = onValue(cartRef, async (snapshot) => {
        const data = snapshot.val() || {};
        const items = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setCartItems(items);
        saveCart(userId, items);
    });
    (async () => {
        const localItems = await loadCart(userId);
        if (localItems.length) setCartItems(localItems);
    })();

    return () => unsubscribe();
    }, []);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) {
      
      handleRemove(id);
      return;
    }
    const userId = auth.currentUser.uid;
    set(ref(db, `carts/${userId}/${id}/quantity`), qty);
  };

  const handleIncrease = (id, currentQty) => {
    handleQuantityChange(id, currentQty + 1);
  };

  const handleDecrease = (id, currentQty) => {
    handleQuantityChange(id, currentQty - 1);
  };
  
  const handleRemove = (id) => {
    const userId = auth.currentUser.uid;
    remove(ref(db, `carts/${userId}/${id}`));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Qty:</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleDecrease(item.id, item.quantity)}
          >
            <Ionicons name="remove" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={item.quantity.toString()}
            onChangeText={(val) => handleQuantityChange(item.id, Number(val))}
          />
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleIncrease(item.id, item.quantity)}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subtotal}>
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </Text>
        
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => handleRemove(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some products to get started!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 20,
    textAlign: "center"
  },
  listContent: {
    paddingBottom: 80
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3
  },
  image: { 
    width: 80, 
    height: 80, 
    resizeMode: "contain",
    borderRadius: 8
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15
  },
  title: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#000000ff",
    marginBottom: 5
  },
  price: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#000000ff",
    marginBottom: 8
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  quantityLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginRight: 8
  },
  quantityButton: {
    backgroundColor: "#3498db",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  quantityInput: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 8, 
    width: 50, 
    borderRadius: 6,
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 8
  },
  subtotal: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start"
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: { 
    fontSize: 18, 
    color: "#7f8c8d",
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bdc3c7"
  },
  totalContainer: { 
    position: "absolute", 
    bottom: 20, 
    left: 20, 
    right: 20, 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 12, 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center"
  },
  total: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#2c3e50" 
  }
});