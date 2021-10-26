/* eslint-disable no-unused-vars */
import React from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

const UnderlinedStyles = StyleSheet.create({
  containerStyle: {
      backgroundColor: 'transparent',
      width: 30,
      alignSelf: 'center',
      margin: 5,
  },
  inputStyle: {
      color: 'grey',
      fontSize: 20,
      fontWeight: 'bold',
      width: 30,
      textAlign: 'center',
      alignSelf: 'center',
  },
  inputContainerStyle: {
      borderBottomWidth: 2,
      borderBottomColor: '#b4bbbf',
      width: 30,
      alignSelf: 'center',
  },
  disabledInputStyle: {
      color: '#b4bbbf',
      fontWeight: 'bold',
  },
});

export interface ITypeRef {
  focus: () => void;
  shake: () => void;
  clear: () => void;
};

export interface IInputStyle {
  containerStyle?: StyleSheet,
  inputStyle?: StyleSheet,
  inputContainerStyle?: StyleSheet,
  placeHolderTextColor?: StyleSheet,
  autoFocus: boolean,
};

export interface ISingleInput extends IInputStyle {
  value: string,
  placeHolder: string,
  keyboardType: any,
  index: number,
  onChange: (inputPos: number, char: string) => void,
  setInputRef: (inputPos: number, inputRef: ITypeRef) => void,
  onKeyPress: (inputPos: number, event: any, inputValue: string) => void,
  clearInputOnFocus: (inputPos: number) => void
  clearInputOnRefresh: (inputPos: number) => void
}

const styles = StyleSheet.create({
  characterRefresh: {
    flexDirection: 'column',
    alignItems: 'center',
    margin:6
  }
})

export const SingleInput: React.FunctionComponent<ISingleInput> = (props: ISingleInput) => {

  return (
    <View style={styles.characterRefresh}>
      <Input
        value={props.value}
        placeholder={props.placeHolder}
        containerStyle={UnderlinedStyles.containerStyle}
        inputStyle={UnderlinedStyles.inputStyle}
        inputContainerStyle={UnderlinedStyles.inputContainerStyle}
        onKeyPress={({nativeEvent}: any) => props.onKeyPress(props.index, nativeEvent, props.value)}
        onChangeText={(text: string) => props.onChange(props.index, text)}
        ref={(ref: any) => props.setInputRef(props.index, ref)}
        maxLength={1}
        keyboardType={props.keyboardType}
        onFocus={() => props.clearInputOnFocus(props.index)}
        autoFocus={props.autoFocus}
      />
      <TouchableOpacity
        onPress={() => props.clearInputOnRefresh(props.index)} >
        <FontAwesomeIcon icon={ faSync } size={32} color="#00FF00" fa-spin/>
      </TouchableOpacity>
    </View>
  );
};

SingleInput.defaultProps = {
  keyboardType: 'default'
}


export default SingleInput;
