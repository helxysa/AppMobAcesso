import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function Map() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Para onde você quer ir?</Text>
        
      </View>

      <ScrollView style={styles.content}>
      <View style={styles.accessibilityPreferences}>
            
            <View style={styles.preferenceOptions}>
              <TouchableOpacity style={styles.preferenceBtn}>
                <Text style={styles.preferenceBtnText}>Linha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceBtn}>
                <Text style={styles.preferenceBtnText}>Rota</Text>
              </TouchableOpacity>
             
            </View>
          </View>
        <View style={styles.routePlanner}>
          <View style={styles.routeInputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Partida</Text>
              <TextInput 
                style={styles.routeInput}
                placeholder="Digite seu local de partida"
                accessibilityLabel="Local de partida"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destino</Text>
              <TextInput 
                style={styles.routeInput}
                placeholder="Digite seu destino"
                accessibilityLabel="Local de destino"
              />
            </View>

            <TouchableOpacity 
              style={styles.routeButton}
              accessibilityLabel="Buscar rota"
            >
              <Text style={styles.buttonText}>Buscar Rota</Text>
            </TouchableOpacity>
          </View>

         
        </View>

        {/* Mock Map Area */}
        <View style={styles.mapSection}>
          <View style={styles.mockMap}>
            <Text style={styles.mockMapText}>Área do Mapa</Text>
          </View>

          <View style={styles.routeDetails}>
            <Text style={styles.routeDetailsTitle}>Detalhes da Rota</Text>
            <View style={styles.routeInfo}>
              <View style={styles.timeDistance}>
                <Text style={styles.time}>42 min</Text>
                <Text style={styles.distance}>3.2 km</Text>
              </View>
            </View>
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