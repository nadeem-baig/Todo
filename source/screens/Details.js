import React from 'react'
import { View, Text,Image,ScrollView } from 'react-native'
const Details = ({route}) => {
    const{address,country,gender,image,hobbies,location,name,signature}=route.params.data

    return (
        <ScrollView style ={{marginLeft:10}}>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Name: {name}</Text>
            <Text  style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10,alignSelf:'center'}}>Image</Text>
            <Image source={{uri:image}} style={{height:200,width:200,alignSelf:'center',borderRadius:10}} />
            <Text  style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10,alignSelf:'center'}}>Signature</Text>
            <Image source={{uri:signature}} style={{height:200,width:200,alignSelf:'center',borderRadius:10}} />
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Address: {address}</Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Country: {country}</Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Gender: {gender}</Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Location:  </Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'300',margin:10,marginLeft:20}}>- latitude: {location[0].latitude}</Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'300',margin:10,marginLeft:20}}>- longitude:{location[0].longitude}</Text>
            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'300',margin:10,marginLeft:20}}>- speed:    {location[0].speed}</Text>
            <Text style ={{fontSize:24,fontWeight:'bold',fontWeight:'300',margin:10,marginLeft:20}}>- altitude: {location[0].altitude}</Text>

            <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'700',margin:10}}>Hobbies:</Text>

            {
                hobbies.map((sorce,key)=>(
                    <Text style ={{fontSize:30,fontWeight:'bold',fontWeight:'500',marginLeft:20}}key={key}>- {sorce}</Text>
                ))
            }

        </ScrollView>
    )
}

export default Details