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
import { clearTasks } from "../../redux/slices/tasksSlice";
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
            dispatch(updateTempList(trueList));
        } catch (err) {
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
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
                    <button onClick={() => { setSortOption('oldest') }}>Oldest↓</button>
                    <button onClick={() => { setSortOption('newest') }}>Newest↓</button>
                    <button onClick={() => { setSortOption('az') }}>AZ↓</button>
                    <button onClick={() => { setSortOption('za') }}>ZA↓</button>
                    <button onClick={() => { setSortOption('tasks') }}>Tasks↓</button>
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
            <button aria-label="Logout" className="Logout-Button" onClick={handleLogout}>
                <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.9999 2C10.2385 2 7.99991 4.23858 7.99991 7C7.99991 7.55228 8.44762 8 8.99991 8C9.55219 8 9.99991 7.55228 9.99991 7C9.99991 5.34315 11.3431 4 12.9999 4H16.9999C18.6568 4 19.9999 5.34315 19.9999 7V17C19.9999 18.6569 18.6568 20 16.9999 20H12.9999C11.3431 20 9.99991 18.6569 9.99991 17C9.99991 16.4477 9.55219 16 8.99991 16C8.44762 16 7.99991 16.4477 7.99991 17C7.99991 19.7614 10.2385 22 12.9999 22H16.9999C19.7613 22 21.9999 19.7614 21.9999 17V7C21.9999 4.23858 19.7613 2 16.9999 2H12.9999Z"
                        fill="var(--element-fill)" />
                    <path
                        d="M13.9999 11C14.5522 11 14.9999 11.4477 14.9999 12C14.9999 12.5523 14.5522 13 13.9999 13V11Z"
                        fill="var(--element-fill)" />
                    <path
                        d="M5.71783 11C5.80685 10.8902 5.89214 10.7837 5.97282 10.682C6.21831 10.3723 6.42615 10.1004 6.57291 9.90549C6.64636 9.80795 6.70468 9.72946 6.74495 9.67492L6.79152 9.61162L6.804 9.59454L6.80842 9.58848C6.80846 9.58842 6.80892 9.58778 5.99991 9L6.80842 9.58848C7.13304 9.14167 7.0345 8.51561 6.58769 8.19098C6.14091 7.86637 5.51558 7.9654 5.19094 8.41215L5.18812 8.41602L5.17788 8.43002L5.13612 8.48679C5.09918 8.53682 5.04456 8.61033 4.97516 8.7025C4.83623 8.88702 4.63874 9.14542 4.40567 9.43937C3.93443 10.0337 3.33759 10.7481 2.7928 11.2929L2.08569 12L2.7928 12.7071C3.33759 13.2519 3.93443 13.9663 4.40567 14.5606C4.63874 14.8546 4.83623 15.113 4.97516 15.2975C5.04456 15.3897 5.09918 15.4632 5.13612 15.5132L5.17788 15.57L5.18812 15.584L5.19045 15.5872C5.51509 16.0339 6.14091 16.1336 6.58769 15.809C7.0345 15.4844 7.13355 14.859 6.80892 14.4122L5.99991 15C6.80892 14.4122 6.80897 14.4123 6.80892 14.4122L6.804 14.4055L6.79152 14.3884L6.74495 14.3251C6.70468 14.2705 6.64636 14.1921 6.57291 14.0945C6.42615 13.8996 6.21831 13.6277 5.97282 13.318C5.89214 13.2163 5.80685 13.1098 5.71783 13H13.9999V11H5.71783Z"
                        fill="var(--element-fill)" />
                </svg>
            </button>
        </div>
    )
};