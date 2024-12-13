import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
    return(
       <Tab.Navigator
       screenOptions = {{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? 90 : 60,
            backgroundColor: COLORS
        }
         }}
         >

         </Tab.Navigator>
    )     
}

export default AppNavigation;