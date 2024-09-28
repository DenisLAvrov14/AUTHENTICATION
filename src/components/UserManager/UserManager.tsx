import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, update, remove, onValue } from 'firebase/database';
import { app } from '../../service/firebaseConfig';
import { User } from '../../models/userTypes';

const UserManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const db = getDatabase(app);

    // Получение всех пользователей из Realtime Database
    useEffect(() => {
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            const usersData = snapshot.val();
            const userList = usersData ? Object.keys(usersData).map(key => ({
                id: key,
                ...usersData[key]
            })) : [];
            setUsers(userList);
        });
    }, []);

    // Добавление нового пользователя
    const addUser = async (newUser: Omit<User, 'id'>) => {
        const userRef = ref(db, 'users/');
        const newUserRef = push(userRef);
        set(newUserRef, newUser);
    };

    // Обновление данных пользователя
    const updateUser = async (id: string, updatedUser: Partial<User>) => {
        const userUpdateRef = ref(db, 'users/' + id);
        update(userUpdateRef, updatedUser);
    };

    // Удаление пользователя
    const deleteUser = async (id: string) => {
        const userDelRef = ref(db, 'users/' + id);
        remove(userDelRef);
    };

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <p>Email: {user.email}</p>
                    <p>Status: {user.status}</p>
                    <button onClick={() => updateUser(user.id, { status: 'active' })}>Activate</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
            ))}
            <button onClick={() => addUser({
                email: 'newuser@example.com', password: 'password123', status: 'pending',
                isBlocked: false
            })}>Add User</button>
        </div>
    );
};

export default UserManager;
