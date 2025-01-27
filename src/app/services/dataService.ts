import { db } from "../firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  QueryDocumentSnapshot
} from "firebase/firestore";

// Fetch data from Firestore
export const fetchData = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  const data = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id, // Firestore document ID
    ...(doc.data() as { name: string; DOB: Timestamp }), // Ensure name and DOB are included
  }));
  return data;
};

// Add a new item to Firestore
export const addItem = async (newItem: { name: string; DOB: Timestamp }) => {
  await addDoc(collection(db, "users"), newItem);
};

// Edit an existing item in Firestore
export const updateItem = async (id: string, updatedItem: { name?: string; DOB?: Timestamp }) => {
  const itemRef = doc(db, "users", id); // Reference to the specific document
  await updateDoc(itemRef, updatedItem); // Update the document with the new data
};

// Delete an item from Firestore
export const deleteItem = async (id: string) => {
  const itemRef = doc(db, "users", id); // Reference to the specific document
  await deleteDoc(itemRef); // Delete the document
};
