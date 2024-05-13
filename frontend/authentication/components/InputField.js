import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const InputField = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry} // true for password, false for username
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '75%',
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15,
  },
  input: {
    flex: 1,
  },
});

export default InputField;
