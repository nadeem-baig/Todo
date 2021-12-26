import Form from './source/screens/form';
import Home from './source/screens/Home';
import Details from './source/screens/Details';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const homechild =()=>
  <Stack.Navigator>
  <Stack.Screen name="Main" component={Home} options ={{headerShown:false}}  options={{ headerShown:false   }}/>
  <Stack.Screen name="Details" component={Details} />

  </Stack.Navigator>

  return (
    <NavigationContainer       >
   <Tab.Navigator>
      <Tab.Screen name="Home"   children={homechild} options={{tabBarIcon: ({color,size})=><FontAwesome name="home" size={24} color="black" />    }}/>
      <Tab.Screen name="Form" component={Form} 
        options={{       tabBarIcon: ({color,size})=>          <FontAwesome name="wpforms" size={size}  color={color} />}}/>
    </Tab.Navigator>
    </NavigationContainer>

  );
}

