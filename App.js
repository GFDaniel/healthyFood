import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import  ProductList  from './src/componets/products-list';

export default function App() {
  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <ProductList/>
      
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
