import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, db, dataconnect } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { createUser } from "../dataconnect-generated";

const getUniversityFromEmail = (email) => {
  if (!email) return "Swastik University";
  const domain = email.split('@')[1];
  if (!domain) return "Swastik University";

  // Mapping of common domains to University names
  const domainMap = {
    'swastik.edu': 'Swastik University',
    'mit.edu': 'Massachusetts Institute of Technology',
    'stanford.edu': 'Stanford University',
    'harvard.edu': 'Harvard University',
    'ox.ac.uk': 'Oxford University',
    'cam.ac.uk': 'Cambridge University',
    'iit.edu': 'IIT Delhi',
    'bits-pilani.ac.in': 'BITS Pilani',
    'gla.ac.in': 'GLA University',
    'dev': 'Developer'
  };

  return domainMap[domain] || domain.split('.')[0].toUpperCase() + " University";
};

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
      const university = getUniversityFromEmail(email);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        domain: email.split('@')[1],
        avatar: "",
        status: "online",
        university: university,
      });
      
      // Sync to Data Connect (SQL)
      try {
        await createUser(dataconnect, {
          id: user.uid,
          name: name,
          email: email,
          university: university,
          domain: email.split('@')[1]
        });
      } catch (dcErr) {
        console.warn("Data Connect Sync Warning (Ignored for now):", dcErr);
      }

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
        const university = getUniversityFromEmail(user.email);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          domain: user.email.split('@')[1],
          avatar: user.photoURL || "",
          status: "online",
          university: university,
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
  },

  // Update user data in Firestore
  updateUserData: async (uid, data) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Update User Data Error:", error);
      throw error;
    }
  }
};
