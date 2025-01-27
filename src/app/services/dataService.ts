import { db } from '../firebaseconfig';
import { collection, getDocs, addDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';

// Fetch data from Firestore
export const fetchData = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  const data = snapshot.docs.map((doc) => doc.data());
  return data;
};

// Add item to Firestore
export const addItem = async (newItem: { name: string; dob: Timestamp; }) => {
  await addDoc(collection(db, 'users'), newItem);
};

// Delete item from Firestore
export const deleteItem = async (id: string) => {
  const itemRef = doc(db, 'users', id);
  await deleteDoc(itemRef);
};
