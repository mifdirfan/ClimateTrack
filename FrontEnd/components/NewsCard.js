// Remove panHandlers from Animated.View wrapping bottomHalf,
// and add them only to dragHandleContainer.

import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function NewsComponent({ imageSource, headline, content }) {
  const expandedHeight = height * 0.75; // full-ish screen height
  const collapsedTranslateY = expandedHeight / 2; // bottom half visible

  const pan = useRef(new Animated.Value(collapsedTranslateY)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        let newVal = gestureState.moveY - gestureState.y0 + pan._offset;

        if (newVal < 0) newVal = 0;
        if (newVal > collapsedTranslateY) newVal = collapsedTranslateY;

        pan.setValue(newVal);
      },
      onPanResponderGrant: () => {
        pan.setOffset(pan._value);
        pan.setValue(0);
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        if (gestureState.dy < -50) {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
            speed: 15,
          }).start();
        } else if (gestureState.dy > 50) {
          Animated.spring(pan, {
            toValue: collapsedTranslateY,
            useNativeDriver: true,
            bounciness: 8,
            speed: 15,
          }).start();
        } else {
          const midpoint = collapsedTranslateY / 2;
          Animated.spring(pan, {
            toValue: pan._value < midpoint ? 0 : collapsedTranslateY,
            useNativeDriver: true,
            bounciness: 8,
            speed: 15,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={styles.headlineGradient}>
          <Text style={styles.headlineText} numberOfLines={2}>
            {headline}
          </Text>
        </LinearGradient>
      </View>

      <Animated.View
        style={[
          styles.bottomHalf,
          {
            height: expandedHeight,
            transform: [{ translateY: pan }],
          },
        ]}
      >
        {/* Only this container controls drag */}
        <Animated.View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </Animated.View>

        {/* ScrollView is scrollable, no panHandlers */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          pointerEvents="box-none"
        >
          <Text style={styles.contentText}>{content}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f4',
  },
  topHalf: {
    height: height / 1.9,
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  headlineGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  headlineText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '600',
  },
  bottomHalf: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  dragHandleContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#222',
    paddingBottom: 20,
  },
});
