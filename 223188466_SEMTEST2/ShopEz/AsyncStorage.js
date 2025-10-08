import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveCart = async (userId, cartItems) => {
  try {
    await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  } catch (err) {
    console.log("AsyncStorage save error:", err);
  }
};
export const loadCart = async (userId) => {
  try {
    const data = await AsyncStorage.getItem(`cart_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.log("AsyncStorage load error:", err);
    return [];
  }
};
