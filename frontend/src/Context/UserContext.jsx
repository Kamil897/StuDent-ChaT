import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem("userData");
      const parsedUser = savedUser ? JSON.parse(savedUser) : {};
      return {
        points: parsedUser.points ?? 5000,
        purchasedItems: parsedUser.purchasedItems ?? [],
        ...parsedUser,
      };
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя из localStorage:", error);
      return { points: 5000, purchasedItems: [] }; // Значения по умолчанию
    }
  };

  const [user, setUser] = useState(loadUserData());

  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const spendPoints = (amount, item) => {
    if (user.points >= amount) {
      const updatedUser = {
        ...user,
        points: user.points - amount,
        purchasedItems: [...user.purchasedItems, item],
      };

      setUser(updatedUser);

      return true; // Возвращаем просто флаг успеха
    }
    return false; // Если очков не хватает
  };

  const removePurchasedItem = (itemId) => {
    setUser((prevUser) => {
      const itemToRemove = prevUser.purchasedItems.find((item) => item.id === itemId);
      if (!itemToRemove) {
        console.warn(`Элемент с ID ${itemId} не найден в списке покупок.`);
        return prevUser; // Возвращаем предыдущего пользователя без изменений
      }

      return {
        ...prevUser,
        points: prevUser.points + itemToRemove.price,
        purchasedItems: prevUser.purchasedItems.filter((item) => item.id !== itemId),
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
        addPoints, // Добавляем функцию addPoints в context
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
