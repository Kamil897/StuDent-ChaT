// src/shop/shop.data.ts
export const PRODUCTS = [
  { id: 1, name: "Sword", description: "A shiny sword", price: 1000, rarity: "common", image: "https://via.placeholder.com/150?text=Sword" },
  { id: 2, name: "Shield", description: "Protect yourself", price: 2000, rarity: "rare", image: "https://via.placeholder.com/150?text=Shield" },
  { id: 3, name: "Crown", description: "Be the king", price: 5000, rarity: "legendary", image: "https://via.placeholder.com/150?text=Crown" },
];

export let user = {
  id: 1,
  points: 5000,
  purchasedItems: [] as number[],
};
