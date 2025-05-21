// PostComponent.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

export default function PostComponent({ user, time, content, imageSource, likes, comments, shares }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.user}>{user}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Image */}
      <Image source={imageSource} style={styles.image} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="thumbs-up" size={20} />
          <Text style={styles.iconText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="comment" size={20} />
          <Text style={styles.iconText}>{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="share" size={20} />
          <Text style={styles.iconText}>{shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    marginLeft: 10,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  content: {
    marginBottom: 10,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    marginLeft: 4,
  },
  reportButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  reportText: {
    fontSize: 12,
    color: 'gray',
  },
});