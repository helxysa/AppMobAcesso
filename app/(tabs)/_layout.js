// app/_layout.js
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const tabIconSize = screenWidth < 375 ? 24 : 28; 
const tabHeight = Platform.OS === 'ios' ? 88 : 68; 

export default function Layout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#0066CC',
        height: Platform.OS === 'ios' ? 96 : 64,
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      tabBarActiveTintColor: '#0066CC',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        display: 'flex',
        height: tabHeight,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        paddingTop: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
      },
      tabBarItemStyle: {
        paddingVertical: 6,
      },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Pontos de Ônibus',
          tabBarLabel: 'Pontos',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="bus-stop" 
              size={focused ? tabIconSize + 4 : tabIconSize} 
              color={color}
              accessibilityLabel="Aba Pontos de Ônibus"
              style={{
                marginBottom: -4,
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="screens/MapScreen" 
        options={{
          title: 'Mapa de Pontos',
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="map-marker-radius" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityLabel="Aba Mapa"
              style={{
                marginBottom: -4,
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="screens/ReportScreen" 
        options={{
          title: 'Reportar Problema',
          tabBarLabel: 'Reportar',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityLabel="Aba Reportar"
              style={{
                marginBottom: -4,
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="screens/ProfileScreen" 
        options={{
          title: 'Meu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="account-circle" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityLabel="Aba Perfil"
              style={{
                marginBottom: -4,
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }} 
      />
    </Tabs>
  );
}