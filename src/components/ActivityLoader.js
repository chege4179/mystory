import React, { useState } from "react";

import { Text, View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";

const ActivityLoader = ({ isLoading }) => {
     return (
          <ActivityIndicator
               size='large'
               animating={isLoading}
               color="#0000ff"
               style={styles.loading}
          />
     );
};
const styles = StyleSheet.create({
     loading: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: Dimensions.get('screen').height * 0.2,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center'
     }
});
export default ActivityLoader;
