import React,{useState,useLayoutEffect} from 'react'
import { View, Text,StyleSheet,Image,ScrollView,RefreshControl,TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Home = ({navigation}) => {
  const[Data,setData]=useState([])
  useLayoutEffect(() => {
    getData().then ((value) => {
      setData(value)  
    })
   },[]);
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = React.useCallback(() => {
     setRefreshing(true);
     setData([])
     getData().then ((value) => {
      setData(value)  
    })     
     wait(1000).then(() => setRefreshing(false));
   }, []);
 
    const getData = async () => {
      
      const array=[]
        try {
          const keys = await AsyncStorage.getAllKeys();
          const result = await AsyncStorage.multiGet(keys);
          const data = JSON.stringify(result)
          const newdata=JSON.parse(data)
          const propertyNames = Object.keys(newdata);
          for(i=0;i<propertyNames.length;i++){
            const data =newdata[i][1]  
             array.push(JSON.parse(data))           
          } 
          return array
        } catch(e) {
          // error reading value
        }
      }


    return (
    <View style={{flex:1}}>
 <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View>

        {
Data.map((source,key) => (
  <TouchableOpacity key={key} onPress={()=>navigation.navigate("Details",{data:source})}>
  <View style={{flexDirection:"row",width:'100%',marginTop:10,backgroundColor:"white",}} >

        <Image source={{uri:source.image}} style={{height:80,width:100,resizeMode:'contain',marginLeft:20,
}} />

        <View style={{width:"100%",height:50,paddingLeft:20, justifyContent:'center'}}>
            <Text style={{fontWeight:"bold",fontWeight:"700",fontSize:20}}>Name: {source.name}</Text>
            <Text style={{fontWeight:"bold",fontWeight:"700",fontSize:20}}>Address: {source.address}</Text>
            

        </View>
        </View> 
        </TouchableOpacity>
))
}



        </View>
      </ScrollView>

     </View>
    )
}
const styles = StyleSheet.create({
    container:{
    }
})
export default Home