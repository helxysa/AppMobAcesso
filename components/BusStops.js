import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import dummydata from '../assets/dummydata.json';
import { useDynamicStyles } from '../utils/useDynamicStyles';

export default function BusStops() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const dynamicStyles = useDynamicStyles({
    subHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    filterBtnText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    accessibilityText: {
      fontSize: 16,
      color: '#000',
      flex: 1,
      letterSpacing: 0.5,
    },
    routeNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1565C0',
      marginRight: 16,
      letterSpacing: 0.5,
    },
    routeDestination: {
      fontSize: 16,
      color: '#000',
      flex: 1,
      letterSpacing: 0.5,
    },
  });

  const renderAccessibilityIcon = (type, description) => {
    const icons = {
      rampa: { 
        name: 'wheelchair-accessibility', 
        color: '#2E7D32', 
        label: 'Rampa de acesso',
        description: 'Ponto com rampa acessível para cadeirantes'
      },
      elevador: { 
        name: 'elevator-passenger', 
        color: '#1565C0', 
        label: 'Elevador',
        description: 'Ponto com elevador para acesso à plataforma'
      },
      pisoTatil: { 
        name: 'walk', 
        color: '#E65100', 
        label: 'Piso tátil',
        description: 'Ponto com piso tátil para auxílio na locomoção'
      }
    };

    const icon = icons[type];
    return icon ? (
      <View 
        style={styles.accessibilityIcon}
        accessible={true}
        accessibilityLabel={`${icon.label}: ${description}`}
        accessibilityRole="image"
        accessibilityHint={icon.description}
      >
        <MaterialCommunityIcons 
          name={icon.name} 
          size={32} 
          color={icon.color} 
        />
      </View>
    ) : null;
  };

  const handleFilterPress = (filter) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection} accessible={true}>
        <Text style={dynamicStyles.subHeader} accessibilityRole="header">
          Para onde você quer ir?
        </Text>
        
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Digite seu destino" 
            accessibilityLabel="Campo de busca de destino"
            accessibilityHint="Digite o nome do local para onde deseja ir"
            placeholderTextColor="#666"
            importantForAccessibility="yes"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            accessibilityLabel="Buscar destino"
            accessibilityRole="button"
            accessibilityHint="Toque duas vezes para buscar o destino digitado"
          >
            <Text style={dynamicStyles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <View 
          style={styles.quickFilters}
          accessible={true}
          accessibilityLabel="Filtros de acessibilidade"
        >
          {['rampa', 'elevador', 'pisoTatil'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterBtn,
                selectedFilter === filter && styles.filterBtnSelected
              ]}
              onPress={() => handleFilterPress(filter)}
              accessibilityLabel={`Filtrar por ${filter}`}
              accessibilityRole="button"
              accessibilityHint={`Toque duas vezes para ${selectedFilter === filter ? 'remover' : 'aplicar'} filtro de ${filter}`}
            >
              <MaterialCommunityIcons 
                name={filter === 'rampa' ? 'wheelchair-accessibility' : 
                      filter === 'elevador' ? 'elevator-passenger' : 'walk'} 
                size={24} 
                color="#fff" 
              />
              <Text style={dynamicStyles.filterBtnText}>
                {filter === 'rampa' ? 'Rampa' : 
                 filter === 'elevador' ? 'Elevador' : 'Piso Tátil'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={dummydata.busStops}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        accessibilityLabel="Lista de pontos de ônibus"
        accessibilityHint="Deslize para cima ou para baixo para navegar entre os pontos"
        accessibilityRole="list"
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ponto de ônibus ${item.name || 'Sem nome'}`}
            accessibilityHint="Toque duas vezes para ver mais detalhes sobre este ponto"
          >
            <Text style={dynamicStyles.cardTitle}>
              {item.name || 'Ponto de ônibus'}
            </Text>
            
            <View 
              style={styles.accessibilityContainer}
              accessible={true}
              accessibilityLabel="Recursos de acessibilidade"
            >
              <Text style={dynamicStyles.sectionTitle}>
                Recursos de Acessibilidade:
              </Text>
              <View style={styles.accessibilityIcons}>
                {item.accessibility?.features ? (
                  item.accessibility.features.map((feature, index) => (
                    <View 
                      key={index} 
                      style={styles.accessibilityItem}
                      accessible={true}
                      accessibilityLabel={`${feature.type}: ${feature.description}`}
                    >
                      {renderAccessibilityIcon(feature.type, feature.description)}
                      <Text style={dynamicStyles.accessibilityText}>
                        {feature.description || 'Recurso de acessibilidade'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={dynamicStyles.accessibilityText}>
                    Informações de acessibilidade não disponíveis
                  </Text>
                )}
              </View>
            </View>

            <View 
              style={styles.routesContainer}
              accessible={true}
              accessibilityLabel="Linhas de ônibus disponíveis"
            >
              <Text style={dynamicStyles.sectionTitle}>
                Linhas Disponíveis:
              </Text>
              {(item.routes || []).map((route, index) => (
                <View 
                  key={index} 
                  style={styles.routeItem}
                  accessible={true}
                  accessibilityLabel={`Linha ${route.line || 'não informada'} com destino a ${route.destination || 'destino não informado'}`}
                >
                  <Text style={dynamicStyles.routeNumber}>
                    {route.line || 'N/A'}
                  </Text>
                  <Text style={dynamicStyles.routeDestination}>
                    {route.destination || 'Destino não informado'}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#1565C0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#1565C0',
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  quickFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1565C0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterBtnSelected: {
    backgroundColor: '#003c8f',
    borderColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 0,
  },
  accessibilityContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  accessibilityIcons: {
    gap: 12,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  accessibilityIcon: {
    marginRight: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  routesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});