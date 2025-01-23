import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

// Cache para armazenar resultados de busca
const searchCache = new Map();

// Cache para rotas
const routeCache = new Map();
const ROUTE_CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

// Controle de requisições
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requisições

const getCacheKey = (query, currentLocation) => {
  if (!currentLocation) return query;
  return `${query}-${currentLocation.latitude.toFixed(3)}-${currentLocation.longitude.toFixed(3)}`;
};

const getRouteCacheKey = (startCoords, endCoords) => {
  return `${startCoords.latitude.toFixed(5)},${startCoords.longitude.toFixed(5)}-${endCoords.latitude.toFixed(5)},${endCoords.longitude.toFixed(5)}`;
};

const getFromCache = (key) => {
  const cached = searchCache.get(key);
  if (!cached) return null;
  
  // Verifica se o cache expirou
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    searchCache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const searchLocation = async (query, currentLocation = null) => {
  try {
    // Verifica o intervalo entre requisições
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      throw new Error('Muitas requisições em um curto período');
    }
    
    // Verifica cache
    const cacheKey = getCacheKey(query, currentLocation);
    const cachedResults = getFromCache(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }

    // Atualiza timestamp da última requisição
    lastRequestTime = now;

    let params = {
      q: query,
      format: 'json',
      limit: 5,
      addressdetails: 1,
    };

    // Se tiver localização atual, adiciona um viés para resultados próximos
    if (currentLocation) {
      // Define uma área de busca de aproximadamente 50km ao redor da localização atual
      const viewboxSize = 0.5; // Aproximadamente 50km
      params = {
        ...params,
        viewbox: [
          currentLocation.longitude - viewboxSize,
          currentLocation.latitude - viewboxSize,
          currentLocation.longitude + viewboxSize,
          currentLocation.latitude + viewboxSize
        ].join(','),
        bounded: 1, // Prioriza resultados dentro do viewbox
      };
    }

    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params,
      headers: {
        'User-Agent': 'MobAcesso App',
      },
    });

    let results = response.data;

    // Se tiver localização atual, ordena por distância
    if (currentLocation && results.length > 0) {
      results = results
        .map(item => ({
          ...item,
          distance: calculateHaversineDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            parseFloat(item.lat),
            parseFloat(item.lon)
          )
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    // Salva no cache
    searchCache.set(cacheKey, {
      data: results,
      timestamp: now,
    });

    return results;
  } catch (error) {
    if (error.response?.status === 429) {
      // Se receber erro de muitas requisições, tenta retornar do cache mesmo expirado
      const cacheKey = getCacheKey(query, currentLocation);
      const cachedResults = searchCache.get(cacheKey)?.data;
      if (cachedResults) {
        return cachedResults;
      }
    }
    console.error('Erro ao buscar localização:', error);
    throw error;
  }
};

export const getRoute = async (startCoords, endCoords) => {
  try {
    const cacheKey = getRouteCacheKey(startCoords, endCoords);
    const cachedRoute = routeCache.get(cacheKey);
    
    if (cachedRoute) {
      const now = Date.now();
      if (now - cachedRoute.timestamp < ROUTE_CACHE_DURATION) {
        return cachedRoute.data;
      }
      routeCache.delete(cacheKey);
    }

    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}`,
      {
        params: {
          overview: 'full',
          geometries: 'geojson',
          steps: true,
          annotations: true, // Adiciona mais detalhes para renderização mais rápida
        },
        timeout: 5000, // Timeout de 5 segundos
      }
    );

    const result = response.data;
    
    // Otimiza os pontos da rota para renderização mais rápida
    if (result.routes?.[0]?.geometry?.coordinates) {
      result.routes[0].geometry.coordinates = simplifyRoute(
        result.routes[0].geometry.coordinates,
        0.00001 // Tolerância de simplificação
      );
    }

    // Salva no cache
    routeCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    throw error;
  }
};

// Calcula a distância entre dois pontos usando a fórmula de Haversine
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// Função para simplificar a rota (reduz pontos mantendo a forma)
function simplifyRoute(coordinates, tolerance) {
  if (coordinates.length <= 2) return coordinates;
  
  const simplified = [];
  simplified.push(coordinates[0]);
  
  for (let i = 1; i < coordinates.length - 1; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const next = coordinates[i + 1];
    
    // Calcula o desvio do ponto atual
    const deviation = pointToLineDistance(curr, prev, next);
    
    if (deviation > tolerance) {
      simplified.push(curr);
    }
  }
  
  simplified.push(coordinates[coordinates.length - 1]);
  return simplified;
}

// Calcula a distância de um ponto para uma linha
function pointToLineDistance(point, lineStart, lineEnd) {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return Math.sqrt(A * A + B * B);
  
  let param = dot / lenSq;
  param = Math.max(0, Math.min(1, param));
  
  const xx = x1 + param * C;
  const yy = y1 + param * D;
  
  const dx = x - xx;
  const dy = y - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
}

export const reverseGeocode = async (coords) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat: coords.latitude,
        lon: coords.longitude,
        format: 'json',
      },
      headers: {
        'User-Agent': 'MobAcesso App',
      },
    });
    
    const address = response.data.display_name;
    // Retorna uma versão mais curta do endereço
    return address.split(',').slice(0, 3).join(',');
  } catch (error) {
    console.error('Erro ao fazer geocodificação reversa:', error);
    return 'Localização atual';
  }
};

export const calculateDistance = (route) => {
  if (!route.routes || !route.routes[0]) return null;
  const distance = route.routes[0].distance;
  return (distance / 1000).toFixed(1); // Converte para km
};

export const calculateDuration = (route) => {
  if (!route.routes || !route.routes[0]) return null;
  const duration = route.routes[0].duration;
  return Math.round(duration / 60); // Converte para minutos
};

export const initialRegion = {
  latitude: -23.5505, // São Paulo
  longitude: -46.6333,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
