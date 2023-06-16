import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { ref, push, set, update, remove, onValue, off } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from '@/components/header';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [user] = useAuthState(auth);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!user) {
            return;
        }
        const todosRef = ref(db, `users/${user.uid}/todos`);
        const todosListener = onValue(todosRef, (snapshot) => {
            const todoList = snapshot.val();
            if (todoList) {
                const todoItems = Object.entries(todoList).map(([id, todo]) => ({
                    id,
                    ...todo,
                }));
                setTodos(todoItems);
            } else {
                setTodos([]);
            }
        });

        return () => {
            off(todosRef, 'value', todosListener);
        };
    }, [user]);

    useEffect(() => {
        const checkedTodos = todos.filter((todo) => todo.checked);
        const checkedCount = checkedTodos.length;
        const newPoints = checkedCount * 10;
        setPoints(newPoints);
    }, [todos]);

    //   useEffect(() => {
    //     const deleteTimeout = setTimeout(() => {
    //         const overdueTodos = todos.filter((todo) => todo.checked);
    //         overdueTodos.forEach((todo) => {
    //             deleteTodo(todo.id);
    //         });
    //     }, 2000);

    //     return () => clearTimeout(deleteTimeout);
    // }, [todos]);

    const addTodo = (event) => {
        event.preventDefault();

        const currentUser = auth.currentUser;
        if (!currentUser) {
            // User not authenticated
            return;
        }

        const todoItem = {
            title: newTodo,
            checked: false,
        };

        const todosRef = ref(db, `users/${currentUser.uid}/todos`);
        const newTodoRef = push(todosRef);

        set(newTodoRef, todoItem).then(() => {
            setNewTodo('');
        }).catch((error) => {
            console.log('Error adding todo:', error);
        });
    };

    const toggleTodo = (todoId, checked) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            const todoRef = ref(db, `users/${userId}/todos/${todoId}`);
            const pointsRef = ref(db, `profile/${userId}/points`);

            update(todoRef, { checked }).then(() => {
                if (checked) {
                    setPoints((prevPoints) => prevPoints + 10);
                    set(pointsRef, points + 10);
                }
            }).catch((error) => {
                console.log('Error updating todo:', error);
            });
        }
    };


    const deleteTodo = (todoId, checked) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
            const todoRef = ref(db, `users/${userId}/todos/${todoId}`);

            remove(todoRef).then(() => {
                if (checked) {
                    setPoints((prevPoints) => prevPoints);
                }
            }).catch((error) => {
                console.log('Error deleting todo:', error);
            });
        }
    };

    if (!auth.currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Todo List</h1>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="flex-grow border border-gray-300 rounded px-4 py-2 mr-2 text-black focus:outline-none"
                        placeholder="Enter a new todo"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-500 focus:outline-none"
                    >
                        Add
                    </button>
                </div>
                <ul className="list-disc list-inside">
                    {todos.map((todo) => (
                        <li key={todo.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={todo.checked}
                                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                                className="mr-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className={`flex-grow ${todo.checked ? 'line-through text-gray-400' : 'text-white'}`}>
                                {todo.title}
                            </span>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="ml-auto bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Dashboard;
