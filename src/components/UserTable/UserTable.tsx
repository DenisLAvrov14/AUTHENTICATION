import { useUsers } from '../../hooks/useUsers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { addUser, updateUser, deleteUser } from '../../service/services';
import { signOut } from 'firebase/auth';
import { auth } from '../../service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';

const UserTable = () => {
    const { data: users, isLoading, error } = useUsers(); // Получаем данные с помощью кастомного хука
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const currentUserId = auth.currentUser?.uid || ''; // Получаем ID текущего пользователя из Firebase

    // Мутация для добавления пользователя
    const addUserMutation = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    // Мутация для обновления пользователя
    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    // Мутация для удаления пользователя
    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    // Используем useCallback для блокировки пользователя
    const handleBlock = useCallback(
        (id: string) => {
            updateUserMutation.mutate({ id, updatedUser: { status: 'blocked' } });
            
            // Если блокируем текущего пользователя, выполняем выход и редирект
            if (id === currentUserId) {
                signOut(auth).then(() => {
                    navigate('/');
                });
            }
        },
        [updateUserMutation, currentUserId, navigate]
    );

    // Используем useCallback для разблокировки пользователя
    const handleUnblock = useCallback(
        (id: string) => {
            updateUserMutation.mutate({ id, updatedUser: { status: 'active' } });
        },
        [updateUserMutation]
    );

    // Обработчик для добавления пользователя
    const handleAddUser = useCallback(() => {
        addUserMutation.mutate({ email: 'newuser@example.com', password: 'password123' });
    }, [addUserMutation]);

    // Обработчик для удаления пользователя
    const handleDelete = useCallback(
        (id: string) => {
            deleteUserMutation.mutate(id);
        },
        [deleteUserMutation]
    );

    // Обработчик для выделения всех пользователей
    const toggleSelectAll = useCallback(() => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedUsers(users?.map(user => user.id) || []); // Фоллбэк на пустой массив
        } else {
            setSelectedUsers([]);
        }
    }, [selectAll, users]);

    // Обработчик блокировки всех выделенных пользователей
    const handleBlockAll = useCallback(() => {
        selectedUsers.forEach((userId) => {
            updateUserMutation.mutate({ id: userId, updatedUser: { status: 'blocked' } });
        });

        // Если текущий пользователь среди заблокированных, перенаправляем на страницу входа
        if (selectedUsers.includes(currentUserId)) {
            signOut(auth).then(() => {
                navigate('/');
            });
        }
    }, [selectedUsers, updateUserMutation, currentUserId, navigate]);

    // Добавление или удаление пользователя из списка выделенных
    const toggleUserSelection = useCallback(
        (userId: string) => {
            setSelectedUsers(prevSelected => 
                prevSelected.includes(userId)
                    ? prevSelected.filter(id => id !== userId)
                    : [...prevSelected, userId]
            );
        },
        []
    );

    // Обработка состояния загрузки и ошибок
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching users</div>;

    return (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <h2>Users List</h2>
                <div className={styles.toolbar}>
                    <button onClick={handleBlockAll} disabled={selectedUsers.length === 0}>
                        Block All
                    </button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                    />
                                </td>
                                <td>{user.email}</td>
                                <td>{user.status || 'No Status'}</td>
                                <td>
                                    {user.status === 'blocked' ? (
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => handleUnblock(user.id)}
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleBlock(user.id)}
                                        >
                                            Block
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-success mt-3" onClick={handleAddUser}>
                    Add User
                </button>
            </div>
        </div>
    );
};

export default UserTable;
