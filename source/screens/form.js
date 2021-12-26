import React,{useState,useEffect,useRef } from 'react';
import { Button, TextInput, View ,StyleSheet ,Picker,Text,ScrollView,  FlatList,Platform,TouchableOpacity,Image,Alert } from 'react-native';
import { Formik } from 'formik';
import Checkbox from 'expo-checkbox';
import { RadioButton  } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
 
const imageSizes = [ {id:1,key:'Cricket',checked:false},{id:2,key:'Hockey',checked:false},{id:3,key:'Football',checked:false},{id:4,key:'Soccer',checked:false},{id:5,key:'Singing',checked:false},{id:6,key:'Dancing',checked:false}];


const form = () => {
  const [Hobbies, setHobbies] = useState(imageSizes);
  const selectedHobbies=[]
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const[Show,setShow]=useState(false)
  const[image,setImage]=useState([])
  const[ShowPreview,setShowPreview]=useState(false)
  const[FormData,setFormData]=useState([])

  const ref = useRef(null)

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, Something Went wrong'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })(),
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
    })();
  }, []);
  
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

const takePictures = async ()=>{
  if(Show){
    const options = { quality: 0.5, base64: true, skipProcessing: true };
    const photo = await ref.current.takePictureAsync(options)
    await handleSave(photo.uri);

  }
}

const handleSave = async (photo) => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY );
  if (status === "granted") {
    const assert = await MediaLibrary.createAssetAsync(photo);
    setImage(assert.uri)
    setShowPreview(true)


    // await MediaLibrary.createAlbumAsync("Tutorial", assert);
  } else {
    console.log("Oh You Missed to give permission");
  }
};

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

const handleChange = (id) => {
  let temp = Hobbies.map((Hobbies) => {
    if (id === Hobbies.id) {
      return { ...Hobbies, checked: !Hobbies.checked };
    }
    return Hobbies;
  });
  setHobbies(temp);
};

const renderFlatList = (renderData) => {
  return (
    <FlatList
      data={renderData}
      renderItem={({ item }) => (
        <View style={{ margin: 5 }}>
          <View>
            <View
              style={{ flexDirection: 'row', flex: 1}}>
                
              <Checkbox
              style={{    margin: 0,height:20,width:20              }}
                value={item.checked}
                onValueChange={() => {handleChange(item.id)                }}
                color={item.checked ? '#4630EB' : undefined}

              />
              <Text style={{ marginLeft:10}} >{item.key}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const storeData = async (value) => {  
  const keys = await AsyncStorage.getAllKeys();
  const result = await AsyncStorage.multiGet(keys);
  const data = JSON.stringify(result)
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(  Date.now().toString(), jsonValue)
    console.log(' saved');

  } catch (e) {
    console.log('error saving');
  }
}

const getData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
  } catch(e) {
    // error reading value
  }
}

  return(    
    
  <ScrollView style={styles.container}>
    {
      Show &&<Camera style={{height:300}}  type={type} ref={ref}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
          <Text style={{backgroundColor:"#841584",width:"10%",height:"40%",fontWeight:'bold',margin:5,borderRadius:50}}> Flip </Text>
        </TouchableOpacity>
      </View>
    </Camera>
    }
     
    

{ Show &&   <View style={{marginTop:10}}>
   <Button  onPress={()=>takePictures()}  title="Take Picture" color="#841584"/></View>}
<View style={{margin:10}}> 
    <Button  onPress={()=>setShow(!Show)}  title={Show ?'Hide':'Take picture'} color="#841584"/></View>
{ShowPreview && <Image source={{uri:image}} style={{width:300,height:200,backgroundColor:"red",flex:1,marginLeft:30}}/>}
 
    <View style={styles.container}>
  </View>
      <Formik
    initialValues={{ name: '',address: '',gender: '',country:'',hobbies:[],location:[],image:'' }}
    onSubmit={(values =>{
      Hobbies.filter(word => word.checked==true ? selectedHobbies.push(word.key):null),
      selectedHobbies.forEach(element => values.hobbies.push(element)),
      values.location.push(location['coords']),
      values.image=image

      if (values.name!=='' && values.address!='' &&values.gender!=''&&values.hobbies!=[] && values.country!=''&& values.image!='' && values.location!=[]) {
        storeData(values),
        Alert.alert(
          "Success",
          "Your Data has been successfully saved",
          [
            { text: "OK"}
          ]
        )
      } else {
        Alert.alert(
          "Chech",
          "Please enter all values or Check For Permissions",
          [
            { text: "OK"}
          ]
        )
      }

    } 
      )}
  >
    {({ handleChange, handleBlur, handleSubmit, values }) => (
      <View>
         {/* <TouchableOpacity onPress={()=>getData()} onLongPress={async()=>{
           AsyncStorage.clear();
           console.log('storage has been cleared');
           
           getData()

     }}>
       <Text>....CLear......</Text>
     </TouchableOpacity> */}
        <Text>Name</Text>
        <TextInput
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          value={values.name}
          placeholder="Name"
          style={styles.input}        />

        <Text>Address</Text>
        <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Address"
        placeholderTextColor="grey"
        numberOfLines={10}
        multiline={true}
        onChangeText={handleChange('address')}
        onBlur={handleBlur('address')}
        value={values.address}
        />

        <View>
        <Text>Gender</Text>
        <RadioButton.Group onValueChange={handleChange('gender')} value={values.gender}         onBlur={handleBlur('gender')}>
            <RadioButton.Item label="Male" value="Male" />
            <RadioButton.Item label="Feamale" value="Feamale" />
            <RadioButton.Item label="Others" value="Others" />
        </RadioButton.Group>
        </View>
        
        <Text>Hobbies</Text>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>{renderFlatList(Hobbies)}</View>  
      </View>

      <Text  style={{  marginTop:5 }}> Country</Text>
     <Picker
        selectedValue={values.country}
        style={{ height: 50, width: 300, marginLeft:20,backgroundColor:"red" }}
        onValueChange={handleChange('country')}
        onBlur={handleBlur('country')}

      >
        <Picker.Item label="india" value="india" />
        <Picker.Item label="US" value="us" />
        <Picker.Item label="UK" value="uk" />
        <Picker.Item label="Germany" value="germany" />
        <Picker.Item label="Canada" value="canada" />
        <Picker.Item label="Turkey" value="turkey" />
      </Picker>

        <View style={{margin:20}}>
        <Button onPress={handleSubmit} title="Submit" />
        </View>
      </View>
    )}
  </Formik>



  </ScrollView>
)
}
    const styles = StyleSheet.create({
  container: {
    marginLeft:10,
    marginRight:10
  },
  input:{
    borderWidth: 1,
    fontWeight:'bold',
    fontWeight:'700',
    borderRadius:10,
    marginBottom:10,
    padding:10
  },

});
export default form