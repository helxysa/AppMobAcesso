// app/_layout.js
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import { useDynamicStyles } from '../../utils/useDynamicStyles';

const { width: screenWidth } = Dimensions.get('window');

// Ajuste dinâmico baseado no tamanho da tela
const tabIconSize = screenWidth < 375 ? 20 : screenWidth < 414 ? 24 : 28;
const tabHeight = Platform.OS === 'ios' 
  ? (screenWidth < 375 ? 70 : 88) 
  : (screenWidth < 375 ? 56 : 68);
const paddingBottom = Platform.OS === 'ios'
  ? (screenWidth < 375 ? 20 : 28)
  : (screenWidth < 375 ? 8 : 12);

export default function Layout() {
  const styles = useDynamicStyles({
    headerTitle: {
      color: '#fff',
      fontSize: screenWidth < 375 ? 16 : 18,
      fontWeight: 'bold',
    },
    tabBarLabel: {
      fontSize: screenWidth < 375 ? 10 : 12,
      fontWeight: '500',
      marginTop: 4,
    }
  });

  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#0066CC',
        height: Platform.OS === 'ios' 
          ? (screenWidth < 375 ? 84 : 96) 
          : (screenWidth < 375 ? 56 : 64),
      },
      headerTitleStyle: styles.headerTitle,
      tabBarActiveTintColor: '#0066CC',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        display: 'flex',
        height: tabHeight,
        paddingBottom: paddingBottom,
        paddingTop: screenWidth < 375 ? 6 : 8,
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
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarItemStyle: {
        paddingVertical: screenWidth < 375 ? 4 : 6,
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