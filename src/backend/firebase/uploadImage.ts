import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, storage } from "./firebaseConfig";

type Image = {
  uri: string;
};

const uploadImage = async ({ uri }: Image) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const refData = ref(storage, `profile_images/${filename}`);
    try {
      await uploadBytes(refData, blob);
      const publicUrl = await getDownloadURL(refData);
      
      return {
        url: publicUrl,
      };
    } catch (e) {
      throw new Error(e);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default uploadImage;
