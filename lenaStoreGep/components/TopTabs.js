import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { Component } from 'react';

export default class TopTabs extends Component {

  render() {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{
           flexDirection: 'row',
           justifyContent: 'space-around',
           borderTopWidth: 1,
           borderTopColor: 'black',
           flexWrap: 'wrap',
           }}>

                {
                   this.props.tabs.map((element, index)=>{
                        return(
                                <TouchableOpacity
                                    /**hitSlop change touch reactivity*/
                                    style={(this.props.tabSelected.button == index) ? 
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    {
                                      backgroundColor: 'rgb(150, 150, 150)',
                                      color: 'white',
                                    } : {}}
                                    onPress={()=>{this.props.onTabPressed(index, this.props.name, element.key)}}
                                    key={index}>
                                    <Text style={
                                      { fontSize: 12, borderTopWidth: StyleSheet.hairlineWidth, }
                                    }>
                                        {element.name || element}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                }

         </View>
    );
  }
}

