/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React, { useLayoutEffect, useState } from "react";
import SplashScreen from "./src/Screens/SplashScreen";
import { Provider } from "react-redux";
import store from "./src/ReduxStore/Store";
import MainApp from "./src/Screens/MainApp";
import { NativeBaseProvider } from "native-base/src/core/NativeBaseProvider";


const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  useLayoutEffect(() => {
    setTimeout(() => {
      setIsVisible(false)
    },2000)

  },[])
  return(
    isVisible ? (<SplashScreen/>):
    (
      <Provider store={store}>
        <NativeBaseProvider>
          <MainApp/>
        </NativeBaseProvider>

    </Provider>
      )
  )
  ;
};

export default App;
