import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import dummydata from '../assets/dummydata.json';

export default function BusStops() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
      </View>
      
      <View style={styles.searchSection}>
        <Text style={styles.subHeader}>Para onde você quer ir?</Text>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Digite seu destino" 
            accessibilityLabel="Campo de busca de destino"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickFilters}>
          <TouchableOpacity 
            style={styles.filterBtn}
            accessibilityLabel="Filtrar por rampa de acesso"
          >
            <Text style={styles.filterBtnText}>Rampa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterBtn}
            accessibilityLabel="Filtrar por elevador"
          >
            <Text style={styles.filterBtnText}>Elevador</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterBtn}
            accessibilityLabel="Filtrar por piso tátil"
          >
            <Text style={styles.filterBtnText}>Piso Tátil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={dummydata.busStops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>Acessibilidade: {item.accessibility.notes}</Text>
            <Text style={styles.cardRoutes}>Linhas:</Text>
            {item.routes.map((route, index) => (
              <Text key={index} style={styles.cardRoute}>
                {route.line} - {route.destination}
              </Text>
            ))}
          </View>
        )}
      />

      {/* <Link href="/screens/MapScreen">
        <Text style={styles.backText}>Voltar</Text>
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
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
  searchSection: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  searchButton: {
    backgroundColor: '#0066CC',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  quickFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardRoutes: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardRoute: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  backText: {
    marginTop: 20,
    color: '#0066CC',
    textAlign: 'center',
  },
});