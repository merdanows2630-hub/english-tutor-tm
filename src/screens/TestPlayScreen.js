import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestPlayScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Test Play Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default TestPlayScreen;