// app/about.js
import { View, Text, Button, FlatList } from 'react-native';
import { Link } from 'expo-router';
import BusStops from '../../components/BusStops';

export default function Home() {
  return (
      <BusStops />
  );
}