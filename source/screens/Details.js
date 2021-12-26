import React from 'react'
import { View, Text,StyleSheet,Image } from 'react-native'
const Details = ({route}) => {
    const{address,country,gender,image,hobbies,location,name}=route.params.data

    return (
        <View style ={styles.container}>
            <Text>Name: {name}</Text>
            <Image source={{uri:image}} style={{height:80,width:100,resizeMode:'contain',marginLeft:20}} />
            <Text>Address: {address}</Text>
            <Text>Country: {country}</Text>
            <Text>Gender: {gender}</Text>
            <Text>Location:  </Text>
            <Text>latitude: {location[0].latitude}</Text>
            <Text>longitude:{location[0].longitude}</Text>
            <Text>speed:    {location[0].speed}</Text>
            <Text>altitude: {location[0].altitude}</Text>

            <Text>Hobbies:</Text>

            {
                hobbies.map((sorce,key)=>(
                    <Text key={key}>{sorce}</Text>
                ))
            }

        </View>
    )
}
const styles = StyleSheet.create({
    container:{
    }
})
export default Details