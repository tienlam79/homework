import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ContactList from './contactList';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ContactList />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});
