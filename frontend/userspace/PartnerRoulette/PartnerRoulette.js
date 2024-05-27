
import {Text, View, Image, StyleSheet } from 'react-native';

const PartnerRoulette = () => {
    return (
        <View style={styles.paigeContainer} >
        <Image source={{
            uri: 'https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
        }}
        style={{ width: 250, height: 250 }}
        />
        </View>
    );
};

export default PartnerRoulette;

const styles = StyleSheet.create({
    paigeContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1  }
})