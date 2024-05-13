import { Text, View, StyleSheet } from 'react-native';
import languages from '../components/languages';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';

export default function Onboarding({ navigation }) {

    const [SelectedLanguages, setSelectedLanguages] = useState([]);

    console.log(languages)

    const languagesPicked = () => {
        if (SelectedLanguages.length > 0 ) {
            navigation.navigate('Profile Creation')
        } else {
            alert('Please at least select one language to proceed');
        };
    };

    return (
        <View>
            <Text style={styles.onboarding}>Pick the languages you wish to learn</Text>
            <View style={{ width: '80%', marginLeft: 40, }} >
            <MultipleSelectList 
            selected={SelectedLanguages}
            setSelected={(value) => setSelectedLanguages(value)}
            style={{ height: 200, marginBottom: 45, 
             flex: 1, height: 200 }}
            data={languages}
            />
            <CustomButton onPress={languagesPicked} title='Continue' /> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    onboarding: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 90,
        marginBottom: 15,
    }
});