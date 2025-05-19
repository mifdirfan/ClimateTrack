// app/screens/NewsScreen.tsx
import NewsCard from '@/components/NewsCard'; // assuming you put NewsCard in app/components
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function NewsScreen() {
  return (
    <ThemedView style={styles.container}>
      <NewsCard />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
