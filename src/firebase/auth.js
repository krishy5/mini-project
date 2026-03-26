import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from './config';

export const signUp = async (studentId, email, password) => {
  if (!auth) throw new Error('Firebase not configured. Add valid credentials to .env file');
  if (!email.endsWith('@kdkce.edu.in')) {
    throw new Error('Only kdkce.edu.in emails are allowed');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(database, `students/${userCredential.user.uid}`), {
    student_id: studentId,
    email,
    created_at: new Date().toISOString()
  });

  return userCredential.user;
};

export const signIn = async (identifier, password) => {
  if (!auth) throw new Error('Firebase not configured. Add valid credentials to .env file');
  const email = identifier.includes('@') ? identifier : `${identifier}@kdkce.edu.in`;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const snapshot = await get(ref(database, `students/${userCredential.user.uid}`));
  
  return { user: userCredential.user, data: snapshot.val() };
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase not configured. Add valid credentials to .env file');
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  
  const snapshot = await get(ref(database, `students/${userCredential.user.uid}`));
  
  if (!snapshot.exists()) {
    await set(ref(database, `students/${userCredential.user.uid}`), {
      student_id: userCredential.user.email.split('@')[0],
      email: userCredential.user.email,
      created_at: new Date().toISOString()
    });
  }
  
  return { user: userCredential.user, data: snapshot.val() };
};

export const logOut = () => signOut(auth);
