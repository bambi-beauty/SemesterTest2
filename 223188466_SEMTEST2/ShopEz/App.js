import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { auth } from './firebase';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import ProductsScreen from './Products';
import ProductDetailScreen from './ProductDetails';
import CartScreen from './Cart';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Products" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register Account' }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'ShopEZ Products' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
