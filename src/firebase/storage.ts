import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";

import {storage} from "./firebase";

export const uploadImage = async (file: any, path: string) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const uploadImages = async (files: any[], path: string) => {
  const multipleImagePromise = files.map(async (file) => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = getDownloadURL(storageRef);
    return downloadURL;
  });
  const result = await Promise.all(multipleImagePromise);
  return result;
};

export const deleteImage = async (imageURL: string) => {
  try {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
  } catch (error) {
    throw error;
  }
};
