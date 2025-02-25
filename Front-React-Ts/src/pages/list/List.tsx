// IMPORTS 
// style 
import "./List.css";
// React
import React, { useState, useEffect, use } from "react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import { selectTasks, addTempTask, removeTempTask, updateTempTask } from "../../redux/slices/tasksSlice";
import { selectLists, addTempList, updateTempList, removeTempList, updateListColor, updateListName, increaseTaskCount, decreaseTaskCount, removeList, addListBack } from "../../redux/slices/listsSlice";

// RRD
import { useNavigate, useParams } from "react-router-dom";

// COMPOENNETS 
import { DBSuccess } from "../../appLevelComponents/DBSuccess";
import { Task } from "./task";

// Variables
const apiUrl = import.meta.env.VITE_API_URL;

// TYPES
type SortOptions = 'newest' | 'due' | 'important' | 'completed';

//COMPONENT//

export const List = () => {
    //Params
    const { id } = useParams();
    // Lists
    const allLists = useSelector(selectLists);
    const currentList = allLists.find(list => list.id === id);
    // Tasks
    const allTasks = useSelector(selectTasks);
    const currentTasks = allTasks.filter(task => task.list_id === id);
    // User
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // TASK NAME //
    const [listName, setListName] = useState<string>(currentList?.name || 'Error');
    const handleChangeListName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setListName(e.target.value);
    };
    // DB success states
    const [dataSaved, setDataSaved] = useState(false);
    const [dataFail, setDataFail] = useState(false);

    // Save task name //
    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            const inputElement = document.querySelector('.Title');
            if (inputElement && !inputElement.contains(event.target as Node)) {
                if (listName !== currentList?.name) {
                    // update the list in the redux store
                    if (id) {
                        dispatch(updateListName({ listId: id, newName: listName }));
                    } else {
                        console.error("List ID is undefined");
                        return;
                    }
                    try {
                        console.log("updating the task name in db")
                        const response = await fetch(`${apiUrl}lists`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${user.authToken}`,
                            },
                            body: JSON.stringify({
                                listId: id,
                                newName: listName,
                            }),
                        });
                        if (!response.ok) {
                            setDataFail(true);
                            setTimeout(() => {
                                setDataFail(false);
                                console.log("fail animate fin")
                            }, 2000);
                            if (id) {
                                dispatch(updateListName({ listId: id, newName: currentList?.name || 'Error' }));
                            }
                            console.error("Error response:", response);
                        }
                        setDataSaved(true);
                        setTimeout(() => {
                            setDataSaved(false);
                        }, 2000);
                        const data = await response.json();
                        console.log(data);
                        // update the redux store with the new task
                    } catch (err) {
                        setDataFail(true);
                        setTimeout(() => {
                            setDataFail(false);
                            console.log("fail animate fin")
                        }, 2000);
                        // dispatch old name to redux
                        if (id) {
                            dispatch(updateListName({ listId: id, newName: currentList?.name || 'Error' }));
                        }
                        console.error(err);
                    }
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [listName, currentList, id, user.authToken]);


    // Task Color //
    const changeTaskColor = async (color: 'element-fill' | 'red' | 'orange' | 'yellow' | 'green' | 'purple' | 'blue') => {
        const prevListColor = currentList?.color;
        try {
            // dispatch new color to redux
            if (id) {
                dispatch(updateListColor({ listId: id, newColor: color }));
            } else {
                console.error("List ID is undefined");
            }

            const response = await fetch(`${apiUrl}lists`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    listId: id,
                    newColor: color,
                }),
            });
            if (!response.ok) {
                setDataFail(true);
                setTimeout(() => {
                    setDataFail(false);
                }, 2000);
                // dispatch old color to redux
                if (id) {
                    if (prevListColor) {
                        dispatch(updateListColor({ listId: id, newColor: prevListColor }));
                    }
                }
                console.error("Error response:", response);
            }
            setDataSaved(true);
            setTimeout(() => {
                setDataSaved(false);
            }, 2000);
            const data = await response.json();
            console.log(data);
            // update the redux store with the new list
        } catch (err) {
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
            }, 2000);
            // dispatch old color to redux
            if (id) {
                if (prevListColor) {
                    dispatch(updateListColor({ listId: id, newColor: prevListColor }));
                }
            };
            console.error(err);
        }
    }

    // INPUT //
    const [inputValue, setInputValue] = useState<string>('');
    const handleChnageInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    // Form 
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue) {
            return;
        }
        const randomString = Math.random().toString(36).substring(2, 6);
        try {
            // Update redux with temp task
            if (id) {
                const newTask = {
                    id: randomString,
                    name: inputValue,
                    completed: false,
                    created_at: new Date().toISOString(),
                    description: 'placeholder',
                    important: false,
                    list_id: id,
                    owner_id: 'placeholder',
                    due_date: null,
                };
                dispatch(addTempTask(newTask));
            } else {
                console.error("List ID is undefined");
                return;
            }
            const response = await fetch(`${apiUrl}tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    parentListId: id,
                    taskName: inputValue,
                }),
            });
            setInputValue('');
            if (!response.ok) {
                setDataFail(true);
                setTimeout(() => {
                    setDataFail(false);
                }, 2000);
                // Remove temp task from redux
                dispatch(removeTempTask(randomString));
                console.error("Error response:", response);
            } else {
                setDataSaved(true);
                setTimeout(() => {
                    setDataSaved(false);
                }, 2000);
                const data = await response.json();
                console.log(data.data);
                const trueTask = data.data;
                // update the redux store with the new list
                dispatch(updateTempTask({ tempTaskId: randomString, trueTask }));
                // Upadte the task count in that list
                dispatch(increaseTaskCount({ listId: id }))
            }
        } catch (err) {
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
            }, 2000);
            // Remove temp list from redux
            dispatch(removeTempTask(randomString));
            console.error(err);
        }
    };

    //Filter Sort //
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const handleToggleFilters = () => {
        setFilterOpen(!filterOpen);
    };
    const [sortOption, setSortOption] = useState<SortOptions>('newest');
    const sortedTasks = currentTasks.sort((a, b) => {
        if (sortOption === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortOption === 'due') {
            return new Date(b.due_date || '9999-12-31').getTime() - new Date(a.due_date || '9999-12-31').getTime();
        }
        else if (sortOption === 'important') {
            return b.important ? 1 : -1;
        }
        else if (sortOption === 'completed') {
            return b.completed ? 1 : -1;
        }
        return 0;
    }
    );


    // DELETE LIST 
    const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);

    const confirmDeleteList = async () => {
        console.log('removing list')
        // Save teh list as it is rigjht now 
        const originalList = currentList;
        // REmove from redux 
        if (id) {
            dispatch(removeList({ listId: id }));
        }
        try {
            const response = await fetch(`${apiUrl}lists`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    listId: id,
                }),
            })

            if (response.ok) {
                navigate('/')
            } else {
                if (originalList && id) {
                    dispatch(addListBack(originalList));
                }
            }

        } catch (err) {
            if (originalList && id) {
                dispatch(addListBack(originalList));
            }
            console.error(err)
        }

    }




    return (
        <div className="List">
            {/* Animation */}
            {dataSaved && <DBSuccess success={true} />}
            {dataFail && <DBSuccess success={false} />}
            {/* TITLE */}
            <input className="Title"
                style={{ color: `var(--${currentList?.color})` }}
                value={listName}
                onChange={handleChangeListName}
            />
            {/* Color slector */}
            <div className="Color-Selector-Container">
                <button
                    style={{
                        backgroundColor: 'var(--element-fill)',
                    }}
                    onClick={() => { changeTaskColor('element-fill') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--red)',
                    }}
                    onClick={() => { changeTaskColor('red') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--orange)',
                    }}
                    onClick={() => { changeTaskColor('orange') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--yellow)',
                    }}
                    onClick={() => { changeTaskColor('yellow') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--green)',
                    }}
                    onClick={() => { changeTaskColor('green') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--blue)',
                    }}
                    onClick={() => { changeTaskColor('blue') }}
                ></button>
                <button
                    style={{
                        backgroundColor: 'var(--purple)',
                    }}
                    onClick={() => { changeTaskColor('purple') }}
                ></button>
            </div>
            {/* INPUT */}
            <form onSubmit={handleSubmitForm}>
                <input
                    value={inputValue}
                    onChange={handleChnageInputValue}
                    placeholder="Create New Task"
                />
            </form>

            {/* FILTER */}
            <div className="Filter-Container">
                <button
                    onClick={handleToggleFilters}
                    className="Filter-Toggle"
                    style={{
                        transform: filterOpen ? 'rotate(-90deg)' : 'rotate(0deg)',
                        backgroundColor: `var(--${currentList?.color})`,
                    }}
                >
                    <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
                            fill="var(--background)" />
                    </svg>
                </button>
                <div
                    className="Filter-Buttons-Container"
                    style={{
                        width: filterOpen ? '100%' : '0px',
                        opacity: filterOpen ? '1' : '0',
                    }}
                >
                    <button onClick={() => { setSortOption('newest') }} >Newest↓</button>
                    <button onClick={() => { setSortOption('due') }}>Due↓</button>
                    <button onClick={() => { setSortOption('important') }}>Important↓</button>
                    <button onClick={() => { setSortOption('completed') }}>Completed</button>

                </div>
            </div>

            {/*  TASK CONTAINER */}
            <div className="Task-Container">
                {sortedTasks.map(task => (
                    <Task task={task} color={currentList?.color} key={task.id} />
                ))}
            </div>

            <button onClick={() => { setConfirmBoxOpen(true) }} className="Delete-List-Button" aria-label="Delete">
                <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 56 56"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M 27.9999 51.9062 C 41.0546 51.9062 51.9063 41.0547 51.9063 28.0000 C 51.9063 14.9219 41.0312 4.0938 27.9765 4.0938 C 14.8983 4.0938 4.0937 14.9219 4.0937 28.0000 C 4.0937 41.0547 14.9218 51.9062 27.9999 51.9062 Z M 22.2109 41.9219 C 20.5468 41.9219 19.5858 41.0078 19.5155 39.3438 L 18.6483 20.2187 L 17.2421 20.2187 C 16.6093 20.2187 16.0702 19.6797 16.0702 19.0469 C 16.0702 18.3906 16.6093 17.875 17.2421 17.875 L 22.5624 17.875 L 22.5624 15.9766 C 22.5624 14.1484 23.7577 13.0000 25.4921 13.0000 L 30.3905 13.0000 C 32.1249 13.0000 33.3202 14.1484 33.3202 15.9766 L 33.3202 17.875 L 38.6405 17.875 C 39.2733 17.875 39.7890 18.3906 39.7890 19.0469 C 39.7890 19.6797 39.2733 20.2187 38.6405 20.2187 L 37.2812 20.2187 L 36.4140 39.3438 C 36.3202 41.0078 35.3593 41.9219 33.6952 41.9219 Z M 24.9296 17.875 L 30.9530 17.875 L 30.9530 16.4219 C 30.9530 15.7891 30.5077 15.3672 29.8514 15.3672 L 26.0077 15.3672 C 25.3749 15.3672 24.9296 15.7891 24.9296 16.4219 Z M 23.6405 39.3438 C 24.2265 39.3438 24.5780 38.9453 24.5546 38.3828 L 23.9921 22.6797 C 23.9452 22.1172 23.5936 21.7422 23.0546 21.7422 C 22.4687 21.7422 22.0936 22.1406 22.1171 22.6797 L 22.7499 38.4062 C 22.7733 38.9687 23.1249 39.3438 23.6405 39.3438 Z M 27.9530 39.3203 C 28.5390 39.3203 28.9140 38.9453 28.9140 38.3828 L 28.9140 22.6797 C 28.9140 22.1406 28.5390 21.7422 27.9530 21.7422 C 27.3671 21.7422 26.9921 22.1406 26.9921 22.6797 L 26.9921 38.3828 C 26.9921 38.9453 27.3905 39.3203 27.9530 39.3203 Z M 32.2890 39.3438 C 32.8046 39.3438 33.1562 38.9687 33.1796 38.4062 L 33.8124 22.6797 C 33.8358 22.1406 33.4374 21.7422 32.8514 21.7422 C 32.3358 21.7422 31.9609 22.1172 31.9374 22.6797 L 31.3749 38.3828 C 31.3514 38.9453 31.7030 39.3438 32.2890 39.3438 Z" />
                </svg>
            </button>

            {confirmBoxOpen &&
                <div className="Overlay">
                    <div className="Confirm-Delete">
                        Are you sure you want to delete <strong>{listName}</strong> and all all {currentList?.task_count} tasks?

                        <div className="Button-Container">
                            <button onClick={() => { setConfirmBoxOpen(false) }} id="no" >NO, go back</button>
                            <button onClick={confirmDeleteList} id="yes">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            }



        </div>
    )
}