import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'

export default function SupportScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 18 }}>For any issues or requests, please email{"\n"}</Text>
      <TouchableOpacity onPress={_ => Linking.openURL('mailto:reactrenaissance@gmail.com?subject=Support')}>
        <Text style={{ fontSize: 18, textDecorationLine: 'underline', color: 'blue' }}>reactrenaissance@gmail.com</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
})