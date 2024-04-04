import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';
function Game(props) {
  const authorizedTagIds = [
    {
      tagID: '1DB3AE513451080',
      name: 'Jone',
      role: 'Admin',
      shift: 'Night',
      department: 'IT',
      isRistricted: true,
    },
    {
      tagID: '1DB3AE51051080',
      name: 'Chetan',
      role: 'Admin',
      shift: 'Morning',
      department: 'IT',
      isRistricted: false,
    },
  ];
  const [accessGranted, setAccessGranted] = useState(false);
  const [isUnAuthorized, setIsUnAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    async function setupNfc() {
      const handleDiscoverTag = tag => {
        // console.warn('Tag Discovered', tag);
        const foundUser = authorizedTagIds.find(
          user => user.tagID.toUpperCase() === tag.id.toUpperCase(),
        );
        if (foundUser) {
          NfcManager.setAlertMessage('Access Granted!');
          console.warn('Access Granted!');
          setCurrentUser(foundUser); // Set the current user
          setAccessGranted(true);
        } else {
          NfcManager.setAlertMessage('Access Denied.');
          console.warn('Access Denied.');
          setCurrentUser(null); // Reset current user
          setAccessGranted(false);
        }

        NfcManager.cancelTechnologyRequest().catch(() => 0);
      };
      //   await NfcManager.registerTagEvent();

      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleDiscoverTag);

      await NfcManager.registerTagEvent();
    }

    setupNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  return (
    <View style={styles.container}>
      {accessGranted && currentUser ? (
        <>
          <Text style={styles.text}>Access Granted!</Text>
          <Text style={styles.text}>Name: {currentUser.name}</Text>
          <Text style={styles.text}>Role: {currentUser.role}</Text>
          <Text style={styles.text}>Shift: {currentUser.shift}</Text>
          <Text style={styles.text}>Department: {currentUser.department}</Text>
        </>
      ) : (
        <Text style={styles.text}>
          {accessGranted
            ? 'Access Granted!'
            : isUnAuthorized
            ? 'Access Denied. Unauthorized User!'
            : 'Scan a Tag'}
        </Text>
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          console.warn('reset');
          setAccessGranted(false);
          setCurrentUser(null);
        }}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  btn: {
    padding: 10,
    backgroundColor: 'lightblue',
    marginTop: 20,
  },
});
export default Game;
