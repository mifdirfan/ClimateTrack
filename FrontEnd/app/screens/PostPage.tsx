// PostPage.tsx
import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PostComponent from '@/components/PostPage';

const comments = [
  {
    id: '1',
    user: 'Daniel',
    time: '2 hrs ago',
    content: 'Body text for a post. Since it’s a social app,',
  },
  {
    id: '2',
    user: 'Daniel',
    time: '2 hrs ago',
    content: 'Body text for a post. Since it’s a social app,',
  },
];

export default function PostPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <PostComponent
        user="User 01"
        time="2 hr. ago"
        content="landslide has occurred near Bukit G, Taman Melawati, which also caused a tree to tumble on the road."
        imageSource={require('@/assets/images/news1.png')} // adjust path
        likes={21}
        comments={21}
        shares={18}
      />

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image
              source={require('@/assets/images/news1.png')} // placeholder avatar
              style={styles.avatar}
            />
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{item.user}</Text>
              <Text style={styles.commentTime}>{item.time}</Text>
              <Text>{item.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity>
                  <FontAwesome name="thumbs-up" size={16} />
                </TouchableOpacity>
                <Text style={styles.iconText}>21</Text>
                <TouchableOpacity>
                  <FontAwesome name="comment" size={16} />
                </TouchableOpacity>
                <Text style={styles.iconText}>21</Text>
                <TouchableOpacity>
                  <FontAwesome name="share" size={16} />
                </TouchableOpacity>
                <Text style={styles.iconText}>18</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* <View style={styles.navBar}>
        <FontAwesome name="home" size={24} />
        <FontAwesome name="search" size={24} />
        <FontAwesome name="exclamation-triangle" size={24} />
        <FontAwesome name="bell" size={24} />
        <FontAwesome name="user" size={24} />
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentTime: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  iconText: {
    marginHorizontal: 4,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});