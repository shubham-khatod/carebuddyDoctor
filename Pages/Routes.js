/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DisplayData from './DisplayData';
import AttendedList from './AttendedList';
import {Image, BackHandler, Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
const height = Dimensions.get('window').height;

const Routes = () => {
  const tab = createBottomTabNavigator();
  return (
    <tab.Navigator
      initialRouteName="DisplayData"
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#DEF1EB', // set background color here
          height: height * 0.085,
        },
        selectedBackgroundColor: 'red',
      }}
      headerShown={false}>
      <tab.Screen
        name="DisplayData"
        component={DisplayData}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 400,
            color: 'black',
            paddingBottom: 5,
          },
          tabBarLabel: 'Un-Attended Patients',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                style={{
                  height: 25,
                  width: 28,
                  tintColor: focused ? 'skyblue' : '#376858',
                }}
                source={require('./patient.png')}
              />
            );
          },
        }}
      />

      <tab.Screen
        name="AttendedList"
        component={AttendedList}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 400,
            color: 'black',
            paddingBottom: 5,
          },
          tabBarLabel: 'Attended Patients',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                style={{
                  height: 25,
                  width: 28,

                  tintColor: focused ? 'skyblue' : '#376858',
                }}
                source={require('./to-do-list.png')}
              />
            );
          },
        }}
      />
    </tab.Navigator>
  );
};

export default Routes;
