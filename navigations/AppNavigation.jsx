import React from 'react';
import { createNativeNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions = {{ headerShown: false }}
                initialRouteName="Main"
            >
                <Stack.Screen name="Main" component={BottomTabNavigation}/>
            </Stack.Navigator>
        </NavigationContainer>
    )     
}

export default AppNavigation;