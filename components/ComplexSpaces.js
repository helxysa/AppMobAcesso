import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import dummydata from '../assets/dummydata.json';

export default function BusStops() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busca</Text>
      <Text style={styles.subtitle}>Escolha abaixo a opção desejada</Text>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Pra onde deseja ir?" 
        />
        <Button title="Buscar" onPress={() => { /* Lógica de busca */ }} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardRoutes: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardRoute: {
    fontSize: 14,
    color: '#333',
  },
  backText: {
    marginTop: 20,
    color: '#0066CC',
    textAlign: 'center',
  },
});