import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { database } from './config';

export const createDocument = (collectionName, docId, data) => 
  setDoc(doc(db, collectionName, docId), data);

export const getDocument = async (collectionName, docId) => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getAllDocuments = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateDocument = (collectionName, docId, data) => 
  updateDoc(doc(db, collectionName, docId), data);

export const deleteDocument = (collectionName, docId) => 
  deleteDoc(doc(db, collectionName, docId));

export const queryDocuments = async (collectionName, field, operator, value) => {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
