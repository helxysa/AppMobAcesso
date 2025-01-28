import { Stack } from 'expo-router/stack';
import { FontSizeProvider } from '../contexts/FontSizeContext';

export default function Layout() {
  return (
    <FontSizeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FontSizeProvider>
  );
}
