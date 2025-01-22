import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function Report() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Colabre com a gente, faça um reporte de acessibilidade ou de area inacessivel</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.routePlanner}>
         
          <View style={styles.accessibilityPreferences}>
            <Text style={styles.preferencesTitle}>Clique no mapa ou insira o local para reportar</Text>
            
          </View>
        </View>

        {/* Mock Map Area */}
        <View style={styles.mapSection}>
          <View style={styles.mockMap}>
            <Text style={styles.mockMapText}>Área do Mapa</Text>
          </View>

         
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  accessibilityButton: {
    backgroundColor: '#0066CC',
    padding: 10,
    borderRadius: 8,
  },
  accessibilityButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  routePlanner: {
    padding: 20,
  },
  routeInputs: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  routeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  routeButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  accessibilityPreferences: {
    marginTop: 20,
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  preferenceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceBtn: {
    flex: 1,
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  preferenceBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  mapSection: {
    flex: 1,
    padding: 20,
  },
  mockMap: {
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mockMapText: {
    fontSize: 18,
    color: '#666',
  },
  routeDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  routeDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  timeDistance: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  distance: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});