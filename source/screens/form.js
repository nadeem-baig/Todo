import React,{useState,useEffect,useRef } from 'react';
import { Button, TextInput, View ,StyleSheet ,Picker,Text,ScrollView,Pressable,  FlatList,Platform,TouchableOpacity,Image,Alert,Modal } from 'react-native';
import { Formik } from 'formik';
import Checkbox from 'expo-checkbox';
import { RadioButton  } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import Signature from "react-native-signature-canvas";
import { Ionicons } from '@expo/vector-icons';

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
  const [signature, setSign] = useState(null);
  const ref = useRef(null)
  const [modalVisible, setModalVisible] = useState(false);

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

const handleOK = (signature) => {
  setSign(signature);
};

const handleEmpty = () => {
  console.log("Empty");
};

const style = `.m-signature-pad--footer
  .button {
    background-color: red;
    color: #FFF;
  }`;

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
    initialValues={{ name: '',address: '',gender: '',country:'',hobbies:[],location:[],image:'',signature:'' }}
    onSubmit={(values =>{
      Hobbies.filter(word => word.checked==true ? selectedHobbies.push(word.key):null),
      selectedHobbies.forEach(element => values.hobbies.push(element)),
      values.location.push(location['coords']),
      values.image=image
      values.signature=signature

      if (values.name!=='' && values.address!='' &&values.gender!=''&&values.hobbies!=[] && values.country!=''&& values.image!='' && values.location!=[] && values.signature!='') {
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
        <Text>Name</Text>
        <TextInput
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          value={values.name}
          placeholder="Name"
          style={styles.input}    
          
          />

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
        <Picker.Item label="Select a country" value="#" />
        <Picker.Item label="india" value="india" />
        <Picker.Item label="US" value="us" />
        <Picker.Item label="UK" value="uk" />
        <Picker.Item label="Germany" value="germany" />
        <Picker.Item label="Canada" value="canada" />
        <Picker.Item label="Turkey" value="turkey" />
      </Picker>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
          
      <View style={{ flex: 1,width:'100%',height:500 }}>
        <Text style={styles.input}>Image Preview</Text>
      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View>
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
    </View>
    

        </View>
        
      </Modal>


      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Add Signature</Text>
      </Pressable>

        <View style={{margin:20}}>
        <Button onPress={handleSubmit} title="Submit" color={'#841584'} />
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
    marginRight:10,
    flex:1
  },
  input:{
    borderWidth: 1,
    fontWeight:'bold',
    fontWeight:'700',
    borderRadius:10,
    marginBottom:10,
    padding:10
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
marginBottom:20
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    width:'100%',height:500,
    backgroundColor:"white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#841584",
  },
  buttonClose: {
    backgroundColor: "#841584",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default form