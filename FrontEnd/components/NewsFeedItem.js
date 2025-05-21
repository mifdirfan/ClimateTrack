// NewsFeedItem.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NewsFeedItem = ({ title, description, image }) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1, // shadow on android
  },
  image: {
    width: 100,
    height: 80,
  },
  textContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
});

export default NewsFeedItem;
