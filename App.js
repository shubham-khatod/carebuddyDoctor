/* eslint-disable react/react-in-jsx-scope */
import {NavigationContainer} from '@react-navigation/native';
import Login from './Pages/Login';
import DisplayData from './Pages/DisplayData';
import {createStackNavigator} from '@react-navigation/stack';
import AttendedList from './Pages/AttendedList';
import Routes from './Pages/Routes';
/* eslint-disable react-native/no-inline-styles */
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Routes"
          component={Routes}
          options={{headerShown: false}}
        />
        {/*<Stack.Screen
          name="AttendedList"
          component={AttendedList}
          options={{headerShown: false}}
  />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
