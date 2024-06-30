import { doc, getDoc, setDoc } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebaseConfig";
import removeUndefinedKeys from "src/utils/removeUndefinedKeys";

export interface Profile {
  _id: string;
  bio: string;
  displayName: string;
  isAvailable: boolean;
  location: string;
  profileImageUri: string;
  phone: string;
}

export interface UpdateProfile {
  displayName?: string;
  location?: string;
  profileImageUri?: string;
  phone?: string;
  bio?: string;
}

export const getProfile = async (): Promise<Profile> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const response = await getDoc(doc(db, "users", user?.uid));
    return {
      _id: user?.uid || "",
      ...response.data(),
    } as Profile;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProfileApi = async (profile: Omit<Profile, "_id">) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), removeUndefinedKeys(profile));
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getProfileById = async (userId: string): Promise<Profile> => {
  try {
    const response = await getDoc(doc(db, "users", userId));
    if (!response.exists()) throw new Error("User not found");
    return {
      _id: userId,
      ...response.data(),
    } as Profile;
  } catch (error) {
    throw new Error(error);
  }
};
