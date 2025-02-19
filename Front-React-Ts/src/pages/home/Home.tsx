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
// COMPOENNETS 
import { DBSuccess } from "../../appLevelComponents/DBSuccess";
// Variables
const apiUrl = import.meta.env.VITE_API_URL;


// TYPES 
interface DecodedToken {
    exp: number;
    [key: string]: any; // Optional: For other decoded fields
}

type SortOptions = 'newest' | 'oldest' | 'az' | 'za' | 'tasks';




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

    // Log out handler //
    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(clearLists());
        dispatch(clearTasks());
        persistor.purge();
    };

    const allLists = useSelector(selectLists);

    // FILTERS //
    const [showFilters, setShowFilters] = useState(false);
    const [sortOption, setSortOption] = useState<SortOptions>('newest');
    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const sortedLists = [...allLists].sort((a, b) => {
        if (sortOption === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOption === 'oldest') {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOption === 'az') {
            return a.name.localeCompare(b.name);
        }
        if (sortOption === 'za') {
            return b.name.localeCompare(a.name);
        }
        if (sortOption === 'tasks') {
            return b.task_count - a.task_count;
        }
        return 0;
    });




    // FORM //
    // States
    const [inputValue, setInputValue] = useState('');
    // Change Handler
    const handleChnageInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    // Submit Handler
    const [dataSaved, setDataSaved] = useState(false);
    const [dataFail, setDataFail] = useState(false);
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
                setDataFail(true);
                setTimeout(() => {
                    setDataFail(false);
                }, 2000);
                dispatch(removeTempList(randomString));
                if (response.status === 403) {
                    handleLogout();
                    return;
                }
                console.error("Error response:", response);
            }
            setDataSaved(true);
            setTimeout(() => {
                setDataSaved(false);
            }, 2000);
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
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
                console.log("fail animate fin")
            }, 2000);
            dispatch(removeTempList(randomString));
            console.error(err);
        }
    };


    return (
        <div className="Home">
            {/* Animation */}
            {dataSaved && <DBSuccess success={true} />}
            {dataFail && <DBSuccess success={false} />}
            {/* Title */}
            <div className="Title">All Lists</div>
            {/* Input */}
            <form onSubmit={handleSubmitForm}>
                <input
                    value={inputValue}
                    onChange={handleChnageInputValue}
                    placeholder="Create New List"
                />
            </form>
            {/* Filter */}
            <div className="Filter-Container">
                <button
                    onClick={handleToggleFilters}
                    className="Filter-Toggle"
                    style={{
                        transform: showFilters ? 'rotate(-90deg)' : 'rotate(0deg)',
                    }}>
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
                        width: showFilters ? '100%' : '0px',
                        opacity: showFilters ? '1' : '0',
                    }}
                >
                    <button onClick={() => { setSortOption('oldest')}}>Oldest↓</button>
                    <button onClick={() => { setSortOption('newest')}}>Newest↓</button>
                    <button onClick={() => { setSortOption('az')}}>AZ↓</button>
                    <button onClick={() => { setSortOption('za')}}>ZA↓</button>
                    <button onClick={() => { setSortOption('tasks')}}>Tasks↓</button>
                </div>
            </div>

            {/* List Container */}
            <div className="ListsContainer">
                {sortedLists.map((list, index) => (
                    <div
                        onClick={() => { navigate(`/list/${list.id}`) }}
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
            {/* Logout button */}
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
};