import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from '../database/config'

import {AuthContext} from '../navigations/AuthContext'

export default function Loading({ route, navigation }) {
  const { userName, password } = route.params;
  const { user, setUser} = useContext(AuthContext);
  useEffect(() => {
    firebase.auth().signInWithEmailAndPassword(userName, password)
      .then((returnUser) => {
        setUser(returnUser.user.uid)
      })
      .catch((error) => {
        navigation.navigate("Login",{error:error})
      })
  }, [])
  return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={60} color='#2BDA8E' />
      </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});
