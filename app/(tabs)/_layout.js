// app/_layout.js
import { Tabs } from 'expo-router';


export default function Layout() {
  return (
    <Tabs screenOptions={{
      headerShown: true, 
      tabBarActiveTintColor: '#0066CC', 
      tabBarStyle: { display: 'flex' },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarLabel: 'Home'
        }} 
      />
      <Tabs.Screen 
        name="screens/MapScreen" 
        options={{
          title: 'Mapa',
          tabBarLabel: 'Mapa'
        }} 
      />
      <Tabs.Screen 
        name="screens/ReportScreen" 
        options={{
          title: 'Reportar',
          tabBarLabel: 'Reportar'
        }} 
      />
      <Tabs.Screen 
        name="screens/ProfileScreen" 
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil'
        }} 
      />
      
    </Tabs>
  );
}