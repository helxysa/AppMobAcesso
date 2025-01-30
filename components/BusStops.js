import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Platform, AccessibilityInfo } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useCallback, useRef } from 'react';
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

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
    waitForInteraction: true
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index;
      const totalItems = dummydata.busStops.length;
      const item = viewableItems[0].item;
      
      const message = `${currentIndex + 1} de ${totalItems} pontos. ${item.name || 'Ponto sem nome identificado'}. ${
        item.accessibility?.features?.length 
          ? `Com ${item.accessibility.features.length} recursos de acessibilidade` 
          : 'Sem informações de acessibilidade'
      }`;

      AccessibilityInfo.announceForAccessibility(message);
    }
  }, []);

  const getItemLayout = useCallback((data, index) => ({
    length: 200, // altura aproximada de cada item
    offset: 200 * index,
    index,
  }), []);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged }
  ]).current;

  return (
    <View style={styles.container}>
      <View 
        style={styles.searchSection} 
        accessible={true}
        accessibilityRole="region"
        accessibilityLabel="Área de busca e filtros"
        accessibilityHint="Nesta seção você pode buscar seu destino e filtrar pontos de ônibus por recursos de acessibilidade"
      >
        <Text 
          style={dynamicStyles.subHeader} 
          accessibilityRole="header"
          accessible={true}
          accessibilityLabel="Para onde você quer ir?"
          accessibilityHint="Abaixo você encontrará um campo de busca e opções de filtro para encontrar seu destino"
        >
          Para onde você quer ir?
        </Text>
        
        <View 
          style={styles.searchContainer}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel="Campo de busca de destino"
          importantForAccessibility="yes"
        >
          <TextInput 
            style={styles.searchInput}
            placeholder="Digite seu destino" 
            accessibilityLabel="Campo para digitar seu destino"
            accessibilityHint="Digite o endereço, nome do local ou ponto de referência. Por exemplo: Rua das Flores, Shopping Centro ou Terminal Central"
            accessibilityRole="search"
            placeholderTextColor="#666"
            importantForAccessibility="yes"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            accessibilityLabel="Buscar pontos de ônibus"
            accessibilityRole="button"
            accessibilityHint="Ao ativar, irá buscar pontos de ônibus próximos ao destino que você digitou"
            accessibilityActions={[{ name: 'activate', label: 'buscar destino' }]}
            onAccessibilityAction={({ nativeEvent: { actionName }}) => {
              if (actionName === 'activate') {
                // Aqui vai a lógica de busca
              }
            }}
          >
            <Text 
              style={dynamicStyles.buttonText}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            >
              Buscar
            </Text>
          </TouchableOpacity>
        </View>

        <View 
          style={styles.quickFilters}
          accessible={true}
          accessibilityRole="tablist"
          accessibilityLabel="Filtros de acessibilidade disponíveis"
          accessibilityHint="Selecione um ou mais recursos para filtrar os pontos de ônibus. Os filtros incluem rampa de acesso, elevador e piso tátil"
        >
          {['rampa', 'elevador', 'pisoTatil'].map((filter) => {
            const isSelected = selectedFilter === filter;
            const filterLabels = {
              rampa: {
                name: 'Rampa de acesso',
                description: 'Filtra pontos com rampa de acesso para cadeirantes'
              },
              elevador: {
                name: 'Elevador',
                description: 'Filtra pontos com elevador para acesso à plataforma'
              },
              pisoTatil: {
                name: 'Piso tátil',
                description: 'Filtra pontos com piso tátil para auxílio na locomoção'
              }
            };

            return (
              <TouchableOpacity 
                key={filter}
                style={[
                  styles.filterBtn,
                  isSelected && styles.filterBtnSelected
                ]}
                onPress={() => handleFilterPress(filter)}
                accessibilityRole="tab"
                accessibilityState={{ 
                  selected: isSelected,
                  disabled: false
                }}
                accessibilityLabel={`${filterLabels[filter].name}${isSelected ? ' (selecionado)' : ''}`}
                accessibilityHint={`${isSelected ? 'Desativar' : 'Ativar'} filtro para ${filterLabels[filter].description}`}
                accessibilityActions={[
                  { name: 'activate', label: isSelected ? 'desativar filtro' : 'ativar filtro' }
                ]}
                onAccessibilityAction={({ nativeEvent: { actionName }}) => {
                  if (actionName === 'activate') {
                    handleFilterPress(filter);
                  }
                }}
              >
                <MaterialCommunityIcons 
                  name={filter === 'rampa' ? 'wheelchair-accessibility' : 
                        filter === 'elevador' ? 'elevator-passenger' : 'walk'} 
                  size={24} 
                  color="#fff"
                  accessibilityElementsHidden={true}
                  importantForAccessibility="no"
                />
                <Text 
                  style={dynamicStyles.filterBtnText}
                  accessibilityElementsHidden={true}
                  importantForAccessibility="no"
                >
                  {filterLabels[filter].name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={dummydata.busStops}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        accessibilityLabel="Lista de pontos de ônibus disponíveis"
        accessibilityHint="Deslize para cima ou para baixo para navegar entre os pontos. Cada ponto mostrará suas informações de acessibilidade."
        accessibilityRole="list"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.card}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ponto ${index + 1} de ${dummydata.busStops.length}${item.name ? ': ' + item.name : ''}`}
            accessibilityHint={`${
              item.accessibility?.features?.length 
                ? `Com ${item.accessibility.features.length} recursos de acessibilidade. ` 
                : 'Sem informações de acessibilidade. '
            }${
              index < dummydata.busStops.length - 1 
                ? 'Deslize para baixo para próximo ponto.' 
                : 'Último ponto da lista.'
            } Toque duas vezes para ver detalhes.`}
          >
            <Text style={dynamicStyles.cardTitle}>
              {item.name || 'Ponto de ônibus'}
            </Text>
            
            <View 
              style={styles.accessibilityContainer}
              accessible={true}
              accessibilityRole="region"
              accessibilityLabel="Recursos de acessibilidade disponíveis neste ponto"
            >
              <Text 
                style={dynamicStyles.sectionTitle}
                accessibilityRole="header"
              >
                Recursos de Acessibilidade:
              </Text>
              <View 
                style={styles.accessibilityIcons}
                accessible={true}
                accessibilityRole="list"
                accessibilityLabel="Lista de recursos de acessibilidade"
              >
                {item.accessibility?.features ? (
                  item.accessibility.features.map((feature, index) => (
                    <View 
                      key={index} 
                      style={styles.accessibilityItem}
                      accessible={true}
                      accessibilityRole="listitem"
                      accessibilityLabel={`${feature.type === 'rampa' ? 'Rampa de acesso' : 
                                         feature.type === 'elevador' ? 'Elevador' : 
                                         'Piso tátil'}`}
                      accessibilityHint={feature.description || 'Sem descrição disponível'}
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
              accessibilityRole="region"
              accessibilityLabel="Linhas de ônibus que param neste ponto"
            >
              <Text 
                style={dynamicStyles.sectionTitle}
                accessibilityRole="header"
              >
                Linhas Disponíveis:
              </Text>
              {(item.routes || []).map((route, index) => (
                <View 
                  key={index} 
                  style={styles.routeItem}
                  accessible={true}
                  accessibilityRole="listitem"
                  accessibilityLabel={`Linha ${route.line || 'número não informado'}`}
                  accessibilityHint={`Destino: ${route.destination || 'destino não informado'}`}
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