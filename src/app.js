import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import Access from './access';

function App(props) {
  const [hasNFC, setHasNFC] = React.useState(false);
  React.useEffect(() => {
    NfcManager.isSupported().then(supported => {
      setHasNFC(supported);
      if (supported) {
        NfcManager.start();
      }
    });
  }, []);

  if (hasNFC === null) {
    return null;
  } else if (!hasNFC) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>NFC is not supported on this device.</Text>
      </View>
    );
  }

  return <Access />;
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
});

export default App;
