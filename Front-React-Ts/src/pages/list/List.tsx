// IMPORTS 
// style 
import "./List.css";
// React
import React, { useState, useEffect } from "react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import { selectLists, addTempList, updateTempList, removeTempList, updateListColor, updateListName } from "../../redux/slices/listsSlice";
// RRD
import { useNavigate, useParams } from "react-router-dom";

// Components

// Variables
const apiUrl = import.meta.env.VITE_API_URL;

//COMPONENT//

export const List = () => {
    const { id } = useParams();
    const allLists = useSelector(selectLists);
    const currentList = allLists.find(list => list.id === id);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // TASK NAME //
    const [listName, setListName] = useState<string>(currentList?.name || 'Error');
    const handleChangeListName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setListName(e.target.value);
    };
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
                            // dispatch old name to redux
                            if (id) {
                                dispatch(updateListName({ listId: id, newName: currentList?.name || 'Error' }));
                            }
                            console.error("Error response:", response);
                        }
                        const data = await response.json();
                        console.log(data);
                        // update the redux store with the new list
                    } catch (err) {
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
                // dispatch old color to redux
                if (id) {
                    if (prevListColor) {
                        dispatch(updateListColor({ listId: id, newColor: prevListColor }));
                    }
                }
                console.error("Error response:", response);
            }
            const data = await response.json();
            console.log(data);
            // update the redux store with the new list
        } catch (err) {
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
        try {
            // Update redux with temp task
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
                // Remove temp list from redux
                console.error("Error response:", response);
            }
            const data = await response.json();
            console.log(data);
            // update the redux store with the new list

        } catch (err) {
            // Remove temp list from redux
            console.error(err);
        }
    };

    //Filter Sort //
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const handleToggleFilters = () => {
        setFilterOpen(!filterOpen);
    };

    return (
        <div className="List">
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
                            fill="var(--primary-text)" />
                    </svg>
                </button>
                <div
                    className="Filter-Buttons-Container"
                    style={{
                        width: filterOpen ? '100%' : '0px',
                        opacity: filterOpen ? '1' : '0',
                    }}
                >
                    <button >Newest↓</button>
                    <button >Due↓</button>
                    <button >Important↓</button>
                    <button >Completed</button>

                </div>
            </div>

            {/*  TASK CONTAINER */}


        </div>
    )
}