import React,{useState,useLayoutEffect} from 'react'
import { View, Text,Image,ScrollView,RefreshControl,TouchableOpacity,Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Home = ({navigation}) => {
  const[Data,setData]=useState([])
  const[AllData,setAllData]=useState([])

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
          setAllData(newdata)
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


    const Deletetodo = async(source)=>{
       AsyncStorage.removeItem(AllData[source][0]).then
      getData().then ((value) => {
        setData(value)  
      })
    }  
      const ThreeButtonAlert = (key) =>{
      Alert.alert(
        "Do you want to make change",
        "If you accidentally opened it click on 'ok'",
        [
          {
            text: "Delete",
            onPress: () => Deletetodo(key),
            style: "destructive"
          },
          {
            text: "Edit",
            onPress: ()=>navigation.navigate("Edit Form",{data: AllData[key][1],address:AllData[key][0]}),
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      }

    return (
    <View style={{flex:1}}>
 <ScrollView
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
  <TouchableOpacity key={key} onPress={()=>navigation.navigate("Details",{data:source})}  onLongPress={()=>ThreeButtonAlert(key)} >
  <View style={{flexDirection:"row",marginTop:15,marginBottom:0,backgroundColor:"white",margin:15,borderRadius:10,padding:5}} >

        <Image source={{uri:source.image}} style={{height:80,width:100,resizeMode:'contain',marginLeft:20,borderRadius:10}} />

        <View style={{width:"100%",height:50,paddingLeft:20, justifyContent:'center',alignSelf:'center'}}>
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


export default Home