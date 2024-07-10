import { StyleSheet, Text, SafeAreaView } from 'react-native'
import React from 'react'

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is just a fun project.</Text>
      <Text style={{textAlign: 'center', marginVertical: 6}}>This app was purely made for practice, learning and development.</Text>
      <Text>Thank you for being part of this.</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
})