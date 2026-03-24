import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { useLang } from './LangContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DictionaryScreen from '../screens/DictionaryScreen';
import TestsScreen from '../screens/TestsScreen';
import TestPlayScreen from '../screens/TestPlayScreen';
import RebusScreen from '../screens/RebusScreen';
import RebusPlayScreen from '../screens/RebusPlayScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const COLORS = {
  primary: '#1B2A4A',
  accent: '#4A90D9',
  gold: '#F5C518',
  bg: '#F0F4FF',
};

function TabNavigator() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Dictionary: focused ? 'book' : 'book-outline',
            Tests: focused ? 'checkbox' : 'checkbox-outline',
            Rebuses: focused ? 'game-controller' : 'game-controller-outline',
            Profile: focused ? 'person' : 'person-outline',
            Admin: focused ? 'shield' : 'shield-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t.home }} />
      <Tab.Screen name="Dictionary" component={DictionaryScreen} options={{ tabBarLabel: t.dictionary }} />
      <Tab.Screen name="Tests" component={TestsScreen} options={{ tabBarLabel: t.tests }} />
      <Tab.Screen name="Rebuses" component={RebusScreen} options={{ tabBarLabel: t.rebuses }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t.profile }} />
      {user?.role === 'admin' && (
        <Tab.Screen name="Admin" component={AdminScreen} options={{ tabBarLabel: t.admin }} />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="TestPlay" component={TestPlayScreen} />
          <Stack.Screen name="RebusPlay" component={RebusPlayScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
