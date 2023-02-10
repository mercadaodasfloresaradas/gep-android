import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

export default function ModalMobile(props) {
  return (
    <Modal transparent={true}>
        <View style={[styles.center, props.hidden ? styles.transparent : {}]}>
            <View style={styles.main}>
                {props.children}
            </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    main:{
        backgroundColor: '#fff',
        height: '60%',
        width: '80%',
        borderRadius: 5,
        padding: 20,
    },
    center:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparent: {
        opacity: 0,
    },
});
