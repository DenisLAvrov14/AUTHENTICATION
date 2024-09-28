import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Функция для синхронизации пользователей
export const syncAuthToFirestore = functions.auth.user().onCreate((user) => {
  // Определите поля, которые хотите сохранить
  const { uid, email, displayName } = user;

  // Ссылка на документ в Firestore
  const userRef = admin.firestore().collection('users').doc(uid);

  // Добавление или обновление данных в Firestore
  return userRef.set({
    email: email, // Email пользователя
    displayName: displayName, // Имя пользователя, если доступно
    createdAt: admin.firestore.FieldValue.serverTimestamp() // Временная метка создания
  });
});
