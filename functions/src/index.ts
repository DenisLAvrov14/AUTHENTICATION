import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Функция для добавления пользователя при регистрации
exports.createUserRecord = functions.auth.user().onCreate(async (user) => {
  const firestore = admin.firestore();
  return firestore.collection('users').doc(user.uid).set({
    email: user.email,
    created: admin.firestore.FieldValue.serverTimestamp(),
    status: 'active',
    isBlocked: false,
  });
});

// Функция для блокировки пользователя
exports.blockUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.firestore().collection('users').doc(uid).update({
    isBlocked: true,
    status: 'blocked',
  });
  await admin.auth().updateUser(uid, {
    disabled: true,
  });
});

// Функция для разблокировки пользователя
exports.unblockUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.firestore().collection('users').doc(uid).update({
    isBlocked: false,
    status: 'active',
  });
  await admin.auth().updateUser(uid, {
    disabled: false,
  });
});

// Функция для удаления пользователя
exports.deleteUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.firestore().collection('users').doc(uid).delete();
  await admin.auth().deleteUser(uid);
});
