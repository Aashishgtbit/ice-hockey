import React from 'react';
import {Modal} from 'react-native';

const CustomModal = (props) => {
  return (
    <Modal
      animationType="none"
      transparent={props.isTransparent || true}
      visible={props.isOpen}
      statusBarTranslucent={props.isStatusBarTranslucent || false}
      onRequestClose={() => {
        // props.handleModalClose();
      }}>
      {props.children}
    </Modal>
  );
};

export default CustomModal;
