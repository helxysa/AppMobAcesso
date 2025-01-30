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
      tabBarAccessibilityLabel: "Menu de navegação principal",
      screenReaderInstructionsHint: "Deslize para a esquerda ou direita para navegar entre as abas",
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Pontos de Ônibus',
          tabBarLabel: 'Pontos',
          tabBarAccessibilityLabel: "Aba Pontos de Ônibus",
          tabBarAccessibilityHint: "Lista de pontos de ônibus próximos com informações de acessibilidade e linhas disponíveis",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="bus-stop" 
              size={focused ? tabIconSize + 4 : tabIconSize} 
              color={color}
              accessibilityRole="image"
              accessibilityLabel={focused ? "Pontos de Ônibus - Aba selecionada" : "Pontos de Ônibus"}
              accessibilityHint="Mostra lista de pontos de ônibus próximos"
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
          tabBarAccessibilityLabel: "Aba Mapa",
          tabBarAccessibilityHint: "Visualize pontos de ônibus no mapa interativo com recursos de acessibilidade",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="map-marker-radius" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityRole="image"
              accessibilityLabel={focused ? "Mapa - Aba selecionada" : "Mapa"}
              accessibilityHint="Mostra mapa interativo com pontos de ônibus"
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
          tabBarAccessibilityLabel: "Aba Reportar Problema",
          tabBarAccessibilityHint: "Reporte problemas de acessibilidade ou outros issues nos pontos de ônibus",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityRole="image"
              accessibilityLabel={focused ? "Reportar Problema - Aba selecionada" : "Reportar Problema"}
              accessibilityHint="Reportar problemas em pontos de ônibus"
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
          tabBarAccessibilityLabel: "Aba Meu Perfil",
          tabBarAccessibilityHint: "Acesse suas preferências e configurações de acessibilidade",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name="account-circle" 
              size={focused ? tabIconSize + 4 : tabIconSize}
              color={color}
              accessibilityRole="image"
              accessibilityLabel={focused ? "Meu Perfil - Aba selecionada" : "Meu Perfil"}
              accessibilityHint="Gerenciar perfil e preferências"
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