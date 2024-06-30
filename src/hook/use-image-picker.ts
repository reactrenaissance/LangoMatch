import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React from "react";

export default function useImagePicker(props): {
  image: string | null;
  pickImage: () => void;
  captureImage: () => void;
  isLoading: boolean;
  file: ImagePicker.ImagePickerResult | null;
  fileName: string | null;
  fileSize: number | null;
} {
  const [image, setImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<ImagePicker.ImagePickerResult | null>(
    null
  );
  // ImagePicker Result
  const [fileName, setFileName] = React.useState<string | null>(null);

  const [fileSize, setFileSize] = React.useState(null);
  const config = props.options || {};

  const opt = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.4,
    ...config,
  };

  const captureImage = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      ...opt,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFile(result);
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      ...opt,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFile(result);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const getFileInfo = async (fileURI: string) => {
      const fileInfo = (await FileSystem.getInfoAsync(fileURI)) as any;
      const { size } = fileInfo;
      setFileName(fileInfo.uri.split("/").pop());

      setFileSize(size);
    };

    if (image) {
      getFileInfo(image);
    }
  }, [image]);

  return {
    image,
    pickImage,
    captureImage,
    isLoading,
    file,
    fileName,
    fileSize,
  };
}
