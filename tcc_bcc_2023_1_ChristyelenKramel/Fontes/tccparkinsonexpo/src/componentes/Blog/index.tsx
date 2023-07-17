import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { TouchableRipple, Card, Paragraph } from 'react-native-paper';

const CardBlog = ({ titulo, descricao, url, imagem }) => {
    const handlePress = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.card}>
            <TouchableRipple onPress={() => handlePress(url)} style={{ marginTop: 20 }}>
                <Card style={{ backgroundColor: '#c9e6ff' }}>
                    <Card.Title title={titulo} titleStyle={{ fontWeight: "bold", fontSize: 25, paddingTop:8 }} />
                    <Card.Content>
                        <Paragraph style={{ fontSize: 18, marginBottom: 10 }}>{descricao}</Paragraph>
                    </Card.Content>
                    {imagem != '' && 
                    <Card.Cover style={{ backgroundColor: '#c9e6ff', borderRadius: 0 , padding:8}} source={{ uri: imagem }} />
                    }
                </Card>
            </TouchableRipple>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        backgroundColor:"#ebf6fa"
    },
});

export default CardBlog;
