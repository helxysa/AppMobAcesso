import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Keyboard, Dimensions } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { searchLocation, getRoute, calculateDistance, calculateDuration, initialRegion, reverseGeocode } from '../services/mapService';
import { debounce } from 'lodash';
import { useDynamicStyles } from '../utils/useDynamicStyles';

export default function Map() {
  const [selectedOption, setSelectedOption] = useState('rota');
  const [region, setRegion] = useState(initialRegion);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeDrawing, setRouteDrawing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const { width: screenWidth } = Dimensions.get('window');
  const buttonWidth = (screenWidth - 60) / 2; // 60 é o padding total (20 de cada lado + 20 de gap)

  const searchInProgress = useRef(false);
  const searchQueue = useRef({ start: null, end: null });
  const searchTimeout = useRef(null);

  const dynamicStyles = useDynamicStyles({
    selectedOptionText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    preferenceBtnText: {
      fontSize: screenWidth < 375 ? 16 : 18,
      fontWeight: '600',
    },
    preferenceBtnTextSelected: {
      color: '#fff',
    },
    preferenceBtnTextUnselected: {
      color: '#1565C0',
    },
    loadingText: {
      marginTop: 10,
      color: '#333',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
    },
    suggestionText: {
      flex: 1,
      fontSize: 14,
      color: '#333',
    },
    distanceText: {
      fontSize: 12,
      color: '#666',
      minWidth: 50,
      textAlign: 'right',
    },
    errorText: {
      color: '#d32f2f',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    routeDetailsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
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
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#333',
    },
    input: {
      fontSize: 16,
      color: '#333',
    },
    placeholder: {
      fontSize: 16,
      color: '#666',
    },
  });

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const processSearchQueue = useCallback(async () => {
    if (searchInProgress.current) return;

    const queue = searchQueue.current;
    if (!queue.start && !queue.end) return;

    searchInProgress.current = true;

    try {
      if (queue.start) {
        const { text, isStart } = queue.start;
        const results = await searchLocation(text, currentLocation);
        const suggestions = results.map(item => ({
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          distance: item.distance,
        }));
        setStartSuggestions(suggestions);
        queue.start = null;
      }

      if (queue.end) {
        const { text } = queue.end;
        const results = await searchLocation(text, currentLocation);
        const suggestions = results.map(item => ({
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          distance: item.distance,
        }));
        setEndSuggestions(suggestions);
        queue.end = null;
      }
    } catch (error) {
      console.error('Erro ao processar fila de busca:', error);
    } finally {
      searchInProgress.current = false;
      // Agenda próximo processamento se houver itens na fila
      if (queue.start || queue.end) {
        searchTimeout.current = setTimeout(() => processSearchQueue(), 1000);
      }
    }
  }, [currentLocation]);

  const queueSearch = useCallback((text, isStart) => {
    if (!text || text.length < 3) {
      if (isStart) {
        setStartSuggestions([]);
        searchQueue.current.start = null;
      } else {
        setEndSuggestions([]);
        searchQueue.current.end = null;
      }
      return;
    }

    if (isStart) {
      searchQueue.current.start = { text, isStart };
    } else {
      searchQueue.current.end = { text, isStart };
    }

    // Inicia o processamento se não estiver em andamento
    if (!searchInProgress.current) {
      processSearchQueue();
    }
  }, [processSearchQueue]);

  // Debounce otimizado que não depende da localização atual
  const debouncedQueueSearch = useCallback(
    debounce((text, isStart) => queueSearch(text, isStart), 800),
    []
  );

  const searchAddressSuggestions = async (text, isStart = true) => {
    if (!text || text.length < 3) {
      isStart ? setStartSuggestions([]) : setEndSuggestions([]);
      setSearchError(null);
      return;
    }

    try {
      setSearchError(null);
      const results = await searchLocation(text, currentLocation);
      const suggestions = results.map(item => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        distance: item.distance,
      }));
      
      isStart ? setStartSuggestions(suggestions) : setEndSuggestions(suggestions);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      if (error.message === 'Muitas requisições em um curto período') {
        // Ignora silenciosamente este erro específico
        return;
      }
      setSearchError('Não foi possível carregar as sugestões. Tente novamente.');
      isStart ? setStartSuggestions([]) : setEndSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion, isStart = true) => {
    const address = suggestion.address.split(',').slice(0, 3).join(',');
    if (isStart) {
      setStartLocation(address);
      setStartSuggestions([]);
      setUseCurrentLocation(false);
    } else {
      setEndLocation(address);
      setEndSuggestions([]);
    }
    Keyboard.dismiss();
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      setLoadingGPS(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos de permissão para acessar sua localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(coords);
      setRegion({
        ...coords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      if (useCurrentLocation) {
        const address = await reverseGeocode(coords);
        setStartLocation(address);
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      alert('Não foi possível obter sua localização');
    } finally {
      setLoadingLocation(false);
      setLoadingGPS(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setUseCurrentLocation(true);
    setStartSuggestions([]);
    if (currentLocation) {
      setLoadingGPS(true);
      try {
        const address = await reverseGeocode(currentLocation);
        setStartLocation(address);
      } finally {
        setLoadingGPS(false);
      }
    } else {
      await getCurrentLocation();
    }
  };

  const handleSearchRoute = async () => {
    try {
      setRouteLoading(true);
      setRouteDrawing(true);
      setLoading(true);
      setRoute(null); // Limpa rota anterior

      let startCoords, endCoords;

      if (useCurrentLocation && currentLocation) {
        startCoords = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
      } else {
        const startResults = await searchLocation(startLocation);
        if (!startResults || startResults.length === 0) {
          alert('Local de partida não encontrado');
          return;
        }
        startCoords = {
          latitude: parseFloat(startResults[0].lat),
          longitude: parseFloat(startResults[0].lon),
        };
      }

      const endResults = await searchLocation(endLocation);
      if (!endResults || endResults.length === 0) {
        alert('Destino não encontrado');
        return;
      }
      endCoords = {
        latitude: parseFloat(endResults[0].lat),
        longitude: parseFloat(endResults[0].lon),
      };

      // Atualiza marcadores imediatamente
      setMarkers([
        { coordinate: startCoords, title: 'Partida' },
        { coordinate: endCoords, title: 'Destino' },
      ]);

      // Ajusta o mapa para mostrar os dois pontos
      const region = {
        latitude: (startCoords.latitude + endCoords.latitude) / 2,
        longitude: (startCoords.longitude + endCoords.longitude) / 2,
        latitudeDelta: Math.abs(startCoords.latitude - endCoords.latitude) * 1.5,
        longitudeDelta: Math.abs(startCoords.longitude - endCoords.longitude) * 1.5,
      };
      setRegion(region);

      setRouteLoading(false); // Remove loading principal

      const routeResult = await getRoute(startCoords, endCoords);
      if (!routeResult.routes || routeResult.routes.length === 0) {
        alert('Não foi possível encontrar uma rota');
        return;
      }

      // Desenha a rota em chunks para melhor performance
      const routeCoordinates = routeResult.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }));

      // Desenha a rota em partes para ser mais suave
      const chunkSize = 20;
      let currentIndex = 0;

      const drawNextChunk = () => {
        const chunk = routeCoordinates.slice(0, currentIndex + chunkSize);
        setRoute(chunk);
        currentIndex += chunkSize;

        if (currentIndex < routeCoordinates.length) {
          requestAnimationFrame(drawNextChunk);
        } else {
          setRouteDrawing(false);
        }
      };

      requestAnimationFrame(drawNextChunk);

      const distance = calculateDistance(routeResult);
      const duration = calculateDuration(routeResult);
      setRouteDetails({ distance, duration });

    } catch (error) {
      console.error('Erro ao buscar rota:', error);
      alert('Erro ao buscar rota. Tente novamente.');
    } finally {
      setRouteLoading(false);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Para onde você quer ir?</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.accessibilityPreferences}>
          <View style={styles.preferenceOptions}>
            <TouchableOpacity 
              style={[
                styles.preferenceBtn,
                { width: buttonWidth },
                selectedOption === 'linha' ? styles.preferenceBtnSelected : styles.preferenceBtnUnselected
              ]}
              onPress={() => setSelectedOption('linha')}
              accessibilityLabel="Selecionar modo linha"
              accessibilityRole="button"
            >
              <Text style={[
                dynamicStyles.preferenceBtnText,
                selectedOption === 'linha' ? styles.preferenceBtnTextSelected : styles.preferenceBtnTextUnselected
              ]}>Linha</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.preferenceBtn,
                { width: buttonWidth },
                selectedOption === 'rota' ? styles.preferenceBtnSelected : styles.preferenceBtnUnselected
              ]}
              onPress={() => setSelectedOption('rota')}
              accessibilityLabel="Selecionar modo rota"
              accessibilityRole="button"
            >
              <Text style={[
                dynamicStyles.preferenceBtnText,
                selectedOption === 'rota' ? styles.preferenceBtnTextSelected : styles.preferenceBtnTextUnselected
              ]}>Rota</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.routePlanner}>
          <Text style={dynamicStyles.selectedOptionText}>
            {selectedOption === 'rota' ? 'Calcular Rota' : 'Encontrar Pontos Próximos'}
          </Text>
          <View style={styles.routeInputs}>
            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Partida</Text>
              <View style={styles.inputWithButton}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.routeInput, dynamicStyles.input]}
                    placeholder="Digite seu local de partida"
                    placeholderTextColor="#666"
                    value={startLocation}
                    onChangeText={(text) => {
                      setStartLocation(text);
                      setUseCurrentLocation(false);
                      setSearchError(null);
                      if (text.length >= 3) {
                        debouncedQueueSearch(text, true);
                      } else {
                        setStartSuggestions([]);
                      }
                    }}
                    accessibilityLabel="Local de partida"
                  />
                  {searchError && (
                    <Text style={dynamicStyles.errorText}>{searchError}</Text>
                  )}
                  {startSuggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      {startSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => handleSelectSuggestion(suggestion, true)}
                        >
                          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" />
                          <View style={styles.suggestionContent}>
                            <Text style={dynamicStyles.suggestionText} numberOfLines={2}>
                              {suggestion.address}
                            </Text>
                            {suggestion.distance && (
                              <Text style={dynamicStyles.distanceText}>
                                {suggestion.distance < 1 
                                  ? `${Math.round(suggestion.distance * 1000)}m`
                                  : `${suggestion.distance.toFixed(1)}km`}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={[
                    styles.locationButton,
                    useCurrentLocation && styles.locationButtonActive
                  ]}
                  onPress={handleUseCurrentLocation}
                  disabled={loadingGPS}
                  accessibilityLabel="Usar localização atual"
                >
                  {loadingGPS ? (
                    <ActivityIndicator size="small" color={useCurrentLocation ? "#fff" : "#0066CC"} />
                  ) : (
                    <MaterialCommunityIcons 
                      name="crosshairs-gps" 
                      size={24} 
                      color={useCurrentLocation ? "#fff" : "#0066CC"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Destino</Text>
              <View style={styles.inputWithButton}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.routeInput, dynamicStyles.input]}
                    placeholder="Digite seu destino"
                    placeholderTextColor="#666"
                    value={endLocation}
                    onChangeText={(text) => {
                      setEndLocation(text);
                      setSearchError(null);
                      if (text.length >= 3) {
                        debouncedQueueSearch(text, false);
                      } else {
                        setEndSuggestions([]);
                      }
                    }}
                    accessibilityLabel="Local de destino"
                  />
                  {endSuggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      {endSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => handleSelectSuggestion(suggestion, false)}
                        >
                          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" />
                          <View style={styles.suggestionContent}>
                            <Text style={dynamicStyles.suggestionText} numberOfLines={2}>
                              {suggestion.address}
                            </Text>
                            {suggestion.distance && (
                              <Text style={dynamicStyles.distanceText}>
                                {suggestion.distance < 1 
                                  ? `${Math.round(suggestion.distance * 1000)}m`
                                  : `${suggestion.distance.toFixed(1)}km`}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.routeButton,
                (!startLocation || !endLocation) && styles.routeButtonDisabled
              ]}
              onPress={handleSearchRoute}
              disabled={loading || !startLocation || !endLocation}
              accessibilityLabel="Buscar rota"
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={dynamicStyles.buttonText}>Buscar Rota</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapSection}>
          {(loadingLocation || routeLoading || routeDrawing) && (
            <View style={[styles.mapLoading, styles.centered]}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={dynamicStyles.loadingText}>
                  {loadingLocation 
                    ? 'Obtendo sua localização...' 
                    : routeLoading 
                      ? 'Calculando melhor rota...'
                      : 'Desenhando rota...'}
                </Text>
              </View>
            </View>
          )}
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
              >
                <View style={[
                  styles.markerContainer,
                  { backgroundColor: index === 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  <MaterialCommunityIcons 
                    name={index === 0 ? "map-marker" : "flag-variant"} 
                    size={24} 
                    color="#fff"
                  />
                </View>
              </Marker>
            ))}
            {route && (
              <>
                <Polyline
                  coordinates={route}
                  strokeWidth={6}
                  strokeColor="rgba(21, 101, 192, 0.2)"
                  lineDashPattern={[0]}
                />
                <Polyline
                  coordinates={route}
                  strokeWidth={3}
                  strokeColor="#1565C0"
                  lineDashPattern={[10, 5]}
                  lineCap="round"
                />
              </>
            )}
          </MapView>

          {routeDetails && (
            <View style={styles.routeDetails}>
              <Text style={dynamicStyles.routeDetailsTitle}>Detalhes da Rota</Text>
              <View style={styles.routeInfo}>
                <View style={styles.timeDistance}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color="#333" />
                    <Text style={dynamicStyles.time}>{routeDetails.duration} min</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="map-marker-distance" size={24} color="#666" />
                    <Text style={dynamicStyles.distance}>{routeDetails.distance} km</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  locationButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066CC',
    backgroundColor: 'transparent',
  },
  locationButtonActive: {
    backgroundColor: '#0066CC',
  },
  routeButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  routeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  accessibilityPreferences: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  preferenceOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  preferenceBtn: {
    height: 48,
    borderRadius: 24, // Mais arredondado
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5, // Borda um pouco mais grossa
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  preferenceBtnSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
    transform: [{ scale: 1.02 }], // Leve aumento quando selecionado
  },
  preferenceBtnUnselected: {
    backgroundColor: '#fff',
    borderColor: '#0066CC',
  },
  preferenceBtnTextSelected: {
    color: '#fff',
  },
  preferenceBtnTextUnselected: {
    color: '#0066CC',
  },
  mapSection: {
    flex: 1,
    padding: 20,
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
  },
  map: {
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  routeDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  routeInfo: {
    padding: 10,
  },
  timeDistance: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  suggestionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});