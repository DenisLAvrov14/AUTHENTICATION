import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import { User } from '../../models/userTypes'; 

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map(doc => ({
                ...doc.data() as User,
                id: doc.id  // Ассоциируем id документа с пользователем
            }));
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleBlock = async (userId: string) => {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { status: 'blocked' });
    };

    const handleUnblock = async (userId: string) => {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { status: 'active' });
    };

    const handleDelete = async (userId: string) => {
        await deleteDoc(doc(db, "users", userId));
    };

    return (
        <div>
        <table className="table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id || 'default-key'}>
                        <td>{user.email}</td>
                        <td>{user.status || 'No Status'}</td>
                        <td>
                        {user.id ? (
    <>
        <button onClick={() => handleBlock(user.id)}>Block</button>
        <button onClick={() => handleUnblock(user.id)}>Unblock</button>
        <button onClick={() => handleDelete(user.id)}>Delete</button>
    </>
) : (
    <span>No actions available</span>
)}

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    
    );
    
};

export default UserTable;
