// IMPORTS 
// style
import "./Home.css";
// React 
import React, { useState, useEffect } from "react";
// jwt-decode
import { jwtDecode } from 'jwt-decode';
// Redux
import { useSelector } from "react-redux";
import { selectUser, clearUser } from "../../redux/slices/userSlice";
import { selectLists, addTempList, updateTempList, clearLists, removeTempList } from "../../redux/slices/listsSlice";
import { selectTasks, clearTasks } from "../../redux/slices/tasksSlice";
import { persistor } from "../../redux/store";
import { useDispatch } from 'react-redux';
// RRD 
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";
// Variables
const apiUrl = import.meta.env.VITE_API_URL;

// TYPES 
interface DecodedToken {
    exp: number;
    [key: string]: any; // Optional: For other decoded fields
}

// COMPOENNETS 


// COMPOENENT
export const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);


    // On Mount 
    // if JWT is expired then revert to log in page
    const token = user.authToken
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            if (decoded.exp * 1000 < Date.now()) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [])

    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(clearLists());
        dispatch(clearTasks());
        persistor.purge();
    };

    const allLists = useSelector(selectLists);

    // Form handler 
    // States
    const [inputValue, setInputValue] = useState('');
    // Change Handler
    const handleChnageInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    // Submit Handler
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('postong list', inputValue, 'authtoken', user.authToken);
        // First make optimistic update to the UI by adding the new list to the redux store // UNDER CONSTRUCTION 
        // Generate random4 char string
        const randomString = Math.random().toString(36).substring(2, 6);
        const newList = {
            id: randomString,
            name: inputValue,
            color: 'element-fill' as 'element-fill',
            task_count: 0,
            created_at: new Date().toISOString(),
            owner_id: 'placeholder',
        }
        // Add the temparary list to the redux store;
        dispatch(addTempList(newList));
        try {
            const response = await fetch(`${apiUrl}lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    listName: inputValue,
                }),
            });
            setInputValue('');
            if (!response.ok) {
                dispatch(removeTempList(randomString));
                if (response.status === 403) {
                    handleLogout();
                    return;
                }
                console.error("Error response:", response);
            }
            const data = await response.json();
            // update the redux store with the new list
            const trueList = {
                listToUpdate: randomString,
                id: data.data.id,
                name: data.data.name,
                color: data.data.color,
                task_count: 0,
                created_at: data.data.created_at,
                owner_id: data.data.owner_id,
            }
            console.log(trueList);
            dispatch(updateTempList(trueList));
        } catch (err) {
            dispatch(removeTempList(randomString));
            console.error(err);
        }
    };


    return (
        <div className="Home">


            <div className="Title">All Lists</div>

            <form onSubmit={handleSubmitForm}>
                <input
                    value={inputValue}
                    onChange={handleChnageInputValue}
                    placeholder="Create New List"
                />
            </form>
            {/* Lists container */}
            <div className="ListsContainer">

                {allLists.map((list, index) => (
                    <div
                        onClick={() => { navigate('/list') }}
                        key={list.id}
                        className="List"
                        style={{
                            background: `var(--${list.color})`,
                            '--delay': `${index * 0.05}s`, // Calculate delay based on index
                        } as React.CSSProperties} // Apply the delay inline using CSS custom properties
                    >
                        <div className="List-Title">{list.name.length > 15 ? `${list.name.slice(0, 15)}...` : list.name}</div>
                        <div className="List-Task-Count">{list.task_count}</div>
                    </div>
                ))}

            </div>
            {/* End */}
            <button onClick={handleLogout}>Log out</button>


        </div>
    )
};