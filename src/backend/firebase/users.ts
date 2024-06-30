import { collection, getDocs, query, where } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebaseConfig";
import { Profile } from "./profile";



export const fetchUsers = async () => {
  try {
    const auth = getAuth();

    const q = query(collection(db, "users"), where("isAvailable", "==", true));

    const querySnapshot = await getDocs(q);

    const fetchedUsers = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    const filteredUsers = fetchedUsers.filter(
      (user) => user._id !== auth.currentUser.uid
    );
    return filteredUsers as Profile[];
  } catch (error) {
    throw new Error(error);
  }
};
