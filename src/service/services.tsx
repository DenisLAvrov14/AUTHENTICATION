import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Получение пользователей из Firestore
export const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { email: string; status: string; isBlocked: boolean }), // Приведение типов
  }));
  return users;
};

// Добавление пользователя в Firestore
export const addUser = async (newUser: { email: string; password: string }) => {
  const docRef = await addDoc(collection(db, 'users'), {
    email: newUser.email,
    password: newUser.password,
    status: 'pending', // Статус по умолчанию
    isBlocked: false,
  });
  return { id: docRef.id, ...newUser, status: 'pending', isBlocked: false };
};

// Обновление пользователя (изменение статуса) в Firestore
export const updateUser = async ({ id, updatedUser }: { id: string; updatedUser: { status: string } }) => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, updatedUser);
  return { id, ...updatedUser };
};

// Удаление пользователя в Firestore
export const deleteUser = async (id: string) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
  return { id };
};
