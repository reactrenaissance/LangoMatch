import { View, Text } from "react-native";
import React from "react";
import { Modal, Spinner } from "@gluestack-ui/themed-native-base";

type LoaderModalProps = {
  isVisible: boolean;
};

export default function LoaderModal(props: LoaderModalProps) {
  return (
    <Modal isOpen={props.isVisible} onClose={() => {}}>
      <Spinner size={"lg"} />
    </Modal>
  );
}
