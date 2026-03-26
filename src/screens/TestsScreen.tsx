import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Tests Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestsScreen;