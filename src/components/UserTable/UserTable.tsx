import { useUsers } from '../../hooks/useUsers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { addUser, updateUser, deleteUser } from '../../service/services';
import styles from './UserTable.module.css'; 

const UserTable = () => {
    const { data: users, isLoading, error } = useUsers(); // Получаем данные с помощью кастомного хука
    const queryClient = useQueryClient();

    // Мутация для добавления пользователя
    const addUserMutation = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Обновляем пользователей после добавления
        },
    });

    // Мутация для обновления пользователя
    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Обновляем пользователей после обновления
        },
    });

    // Мутация для удаления пользователя
    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Обновляем пользователей после удаления
        },
    });

    // Используем useCallback для блокировки пользователя
    const handleBlock = useCallback(
        (id: string) => {
            updateUserMutation.mutate({ id, updatedUser: { status: 'blocked' } });
        },
        [updateUserMutation]
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

    // Обработка состояния загрузки и ошибок
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching users</div>;

    return (
        <div className={styles.outerContainer}>
          <div className={styles.container}>
            <h2>Users List</h2>
            <ul className={styles['list-group']}>
              {users &&
                users.map((user) => (
                  <li key={user.id} className={styles['list-group-item']}>
                    <div>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Status:</strong> {user.status || 'No Status'}
                      </p>
                    </div>
                    <div>
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
                    </div>
                  </li>
                ))}
            </ul>
            <button className="btn btn-success mt-3" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>
      );
      
};

export default UserTable;
