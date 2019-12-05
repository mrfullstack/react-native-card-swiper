/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import SwipeCard from './src/components/SwipeCard'

const App = () => {
  return (
    <View style={styles.container}>
      <SwipeCard/>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});

export default App;
