import React from "react";

import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DraftCard = ({ draft }) => {
     const navigation = useNavigation()
     const GoToAddPostScreen =() => {
          navigation.navigate('AddPostScreen',{ draft })
     }
     return (
          <TouchableOpacity onPress={GoToAddPostScreen}>
               <View style={styles.container}>
                    <Text style={styles.title}>{draft.posttitle}</Text>
                    <Text style={styles.body}>{draft.postbody}</Text>
               </View>
          </TouchableOpacity>

     );
};
const styles = StyleSheet.create({
     container: {
          width:Dimensions.get('screen').width,
          height:Dimensions.get('screen').height * 0.1,
          flex: 1,
          paddingLeft:Dimensions.get('screen').width * 0.2,
          paddingTop:10,
          borderLeftColor:'white',
          borderRightColor:'white',
          borderTopColor:'black',
          borderBottomColor:'black',
          borderWidth:1,
          marginHorizontal:10
     },
     title:{
          fontSize:17,
          fontWeight:'bold',

     },
     body:{
          fontSize:16,

     }
});
export default DraftCard;
