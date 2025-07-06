import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem("userData");
      const parsedUser = savedUser ? JSON.parse(savedUser) : {};
      return {
        points: parsedUser.points ?? 5000,
        purchasedItems: Array.isArray(parsedUser.purchasedItems) 
          ? parsedUser.purchasedItems.filter(item => item && item.id) 
          : [],
        ...parsedUser,
      };
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя из localStorage:", error);
      return { points: 5000, purchasedItems: [] };
    }
  };

  const [user, setUser] = useState(loadUserData());

  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const spendPoints = (amount, item) => {
    if (user.points >= amount && item && item.id) {
      const updatedUser = {
        ...user,
        points: user.points - amount,
        purchasedItems: [...user.purchasedItems, item],
      };

      setUser(updatedUser);
      return true;
    }
    return false;
  };

  const removePurchasedItem = (itemId) => {
    setUser((prevUser) => {
      const safeItems = prevUser.purchasedItems.filter(item => item && item.id);
      const itemToRemove = safeItems.find((item) => item.id === itemId);
      if (!itemToRemove) {
        console.warn(`Элемент с ID ${itemId} не найден.`);
        return prevUser;
      }

      return {
        ...prevUser,
        points: prevUser.points + itemToRemove.price,
        purchasedItems: safeItems.filter((item) => item.id !== itemId),
      };
    });
  };

  const addPoints = (points) => {
    setUser((prevUser) => ({
      ...prevUser,
      points: prevUser.points + points,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        spendPoints,
        removePurchasedItem,
        addPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
