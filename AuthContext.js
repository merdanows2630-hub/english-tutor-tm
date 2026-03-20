import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const ADMIN = { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin', email: 'admin@app.com', score: 0, completedTests: [] };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([ADMIN]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await AsyncStorage.getItem('currentUser');
      const us = await AsyncStorage.getItem('users');
      if (u) setUser(JSON.parse(u));
      if (us) setUsers(JSON.parse(us));
    } catch (e) {}
    setLoading(false);
  };

  const saveUsers = async (list) => {
    await AsyncStorage.setItem('users', JSON.stringify(list));
    setUsers(list);
  };

  const login = async (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      await AsyncStorage.setItem('currentUser', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Ulanyjy ady ýa-da açar sözi nädogry' };
  };

  const register = async (data) => {
    if (users.find(u => u.username === data.username)) {
      return { success: false, error: 'Bu ulanyjy ady eýýäm bar' };
    }
    const newUser = {
      id: Date.now().toString(),
      ...data,
      role: 'user',
      score: 0,
      completedTests: [],
      favorites: [],
      joinDate: new Date().toLocaleDateString(),
    };
    const updated = [...users, newUser];
    await saveUsers(updated);
    setUser(newUser);
    await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('currentUser');
  };

  const updateUser = async (id, data) => {
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    await saveUsers(updated);
    if (user?.id === id) {
      const newU = { ...user, ...data };
      setUser(newU);
      await AsyncStorage.setItem('currentUser', JSON.stringify(newU));
    }
  };

  const deleteUser = async (id) => {
    const updated = users.filter(u => u.id !== id);
    await saveUsers(updated);
  };

  const addScore = async (points) => {
    if (!user) return;
    const newScore = (user.score || 0) + points;
    await updateUser(user.id, { score: newScore });
  };

  const toggleFavorite = async (wordId) => {
    if (!user) return;
    const favs = user.favorites || [];
    const newFavs = favs.includes(wordId) ? favs.filter(f => f !== wordId) : [...favs, wordId];
    await updateUser(user.id, { favorites: newFavs });
  };

  return (
    <AuthContext.Provider value={{ user, users, loading, login, register, logout, updateUser, deleteUser, addScore, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
