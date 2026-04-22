import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const authService = {
  // Login with Email/Password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  // Register with Email/Password
  register: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        avatar: "",
        status: "online",
        university: "Swastik University",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      return user;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  // Google Login
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL || "",
          status: "online",
          university: "Swastik University",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        await setDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp(),
          status: "online"
        }, { merge: true });
      }

      return user;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          status: "offline",
          lastActive: serverTimestamp()
        }, { merge: true });
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  // Get current user data from Firestore
  getUserData: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Get User Data Error:", error);
      return null;
    }
  }
};
