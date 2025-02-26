// IMPORTS 
// Styles 
import "./Task.css";

// React 
import React, { useEffect, useState } from "react";

// RRD 

// Redux 
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import { updateTempTask } from "../../redux/slices/tasksSlice";

// COMPOENNETS 
import { DBSuccess } from "../../appLevelComponents/DBSuccess";

// Variables
const apiUrl = import.meta.env.VITE_API_URL;

// TYPES 
type Task = {
    id: string,
    name: string,
    completed: boolean,
    created_at: string,
    description: string | null,
    important: boolean,
    list_id: string,
    owner_id: string,
    due_date: string | null
}


interface TaskProps {
    task: Task;
    color: "element-fill" | "red" | "orange" | "yellow" | "green" | "purple" | "blue" | undefined;
}


// COMPONENT 
export const Task = ({ task, color }: TaskProps) => {
    // Dispatch 
    const dispatch = useDispatch();
    const user = useSelector(selectUser);


    // Form states
    const [title, setTitle] = useState(task.name);
    const [dueDate, setDueDate] = useState(task.due_date);
    const [description, setDescription] = useState(task.description);

    // UseEffect to check if originals have neem dited 
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    useEffect(() => {
        if ((title !== task.name) || (dueDate !== task.due_date) || (description !== task.description)) {
            setIsBeingEdited(true);
        } else {
            setIsBeingEdited(false);
        }
    }, [title, dueDate, description])


    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }
    const handleChangeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(e.target.value);
    };
    const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        if (e.target.value === "") {
            setDescription(null);
        }
    };


    //Use effect to watch text area od description and increase vertical height of area when more text inputted
    useEffect(() => {
        const textarea = document.querySelector(".Task-Description") as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [description]);

    // Save changes to title, des or date
    const saveChanges = async () => {

        const originalTitle = task.name;
        const originalDescription = task.description;
        const originalDueDate = task.due_date;

        // UPdate redux with new task 
        dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, name: title, description: description, due_date: dueDate } }))
        try {
            const response = await fetch(`${apiUrl}tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    newName: title,
                    newDescription: description,
                    newDueDate: dueDate,
                    taskId: task.id
                }),
            });
            if (!response.ok) {
                dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, name: originalTitle, description: originalDescription, due_date: originalDueDate } }))
                setIsBeingEdited(false);
            } else {
                setIsBeingEdited(false);
            }
        } catch (err) {
            dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, name: originalTitle, description: originalDescription, due_date: originalDueDate } }))
            setIsBeingEdited(false);
            console.error(err);
        }

    }

    // revert changes to form 
    const revertChanges = () => {
        setTitle(task.name);
        setDescription(task.description);
        setDueDate(task.due_date)
    }



    // DB Success State 
    // DB success states
    const [dataSaved, setDataSaved] = useState(false);
    const [dataFail, setDataFail] = useState(false);


    // Toggle Important
    const toggleImportant = async () => {
        const currentState = task.important;
        // Update the task in the redux store
        dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, important: !currentState } }))
        // Update teh backemd and handle reponse 
        try {
            const response = await fetch(`${apiUrl}tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    newImportant: !currentState,
                    taskId: task.id
                }),
            });
            if (response.ok) {
                setDataSaved(true);
                setTimeout(() => {
                    setDataSaved(false);
                }, 2000);
            } else {
                setDataFail(true);
                setTimeout(() => {
                    setDataFail(false);
                }, 2000);
                // revert redux 
                dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, important: currentState } }))
            }
        } catch (err) {
            dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, important: currentState } }))
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
            }, 2000);
            console.error(err);
        }


    }
    // Toggle completed
    const toggleCompleted = async () => {
        const originalState = task.completed;
        // Dispatch to redux new completed state
        dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, completed: !originalState } }))
        try {
            const response = await fetch(`${apiUrl}tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.authToken}`,
                },
                body: JSON.stringify({
                    newCompleted: !originalState,
                    taskId: task.id
                }),
            });
            if (response.ok) {
                setDataSaved(true);
                setTimeout(() => {
                    setDataSaved(false);
                }, 2000);
            } else {
                setDataFail(true);
                setTimeout(() => {
                    setDataFail(false);
                }, 2000);
                // revert redux 
                dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, completed: originalState } }))
            }
        } catch (err) {
            dispatch(updateTempTask({ tempTaskId: task.id, trueTask: { ...task, completed: originalState } }))
            setDataFail(true);
            setTimeout(() => {
                setDataFail(false);
            }, 2000);
            console.error(err);
        }
    }





    return (
        <div className='Task' style={{ backgroundColor: `var(--${color}-fill`, opacity: task.completed ? "0.5" : "1" }} >
            {/* Animation */}
            {dataSaved && <DBSuccess success={true} />}
            {dataFail && <DBSuccess success={false} />}


            <div className="Important">
                <svg
                    onClick={toggleImportant}
                    style={{ fill: task.important ? `var(--${color})` : `var(--background)` }}
                    height="30px" width="30px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <style type="text/css">
                    </style>
                    <g>
                        <path d="M238.301,346.393c0.598,3.938,2.563,7.725,5.903,11.359c3.313,3.626,7.252,5.447,11.796,5.447
		c10.592,0,16.486-5.608,17.691-16.806l35.398-271.98c0.607-4.823,0.911-11.636,0.911-20.415c0-13.618-4.679-26.013-14.065-37.22
		C286.558,5.59,273.244,0,255.999,0c-17.868,0-31.317,5.742-40.389,17.226c-9.073,11.206-13.61,23.459-13.61,36.773
		c0,8.172,0.285,14.976,0.892,20.415L238.301,346.393z"/>
                        <path d="M295.033,418.065c-10.288-10.287-23.307-15.44-39.034-15.44c-15.422,0-28.441,5.314-39.032,15.896
		c-10.591,10.591-15.877,23.441-15.877,38.569c0,14.52,5.286,27.379,15.877,38.577C227.558,506.562,240.578,512,255.999,512
		c15.423,0,28.424-5.286,39.034-15.886c10.574-10.574,15.877-23.593,15.877-39.024C310.91,441.658,305.607,428.656,295.033,418.065z
		"/>
                    </g>
                </svg>
            </div>

            <div className="Task-Info-Wrapper" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                <input className="Task-Name"
                    value={title}
                    onChange={handleChangeTitle}
                />



                {dueDate && <input
                    className="Task-Due-Date"
                    type="date"
                    value={dueDate || ''}
                    onChange={handleChangeDueDate}
                />}



                <textarea className="Task-Description"
                    value={description || ""}
                    onChange={handleChangeDescription}
                    rows={1}
                    placeholder="No Description" />
            </div>

            {isBeingEdited ?
                <div className="EditBtnContainer">
                    <button onClick={saveChanges} aria-label="Save">
                        <svg
                            id="SaveSVG"
                            fill="var(--background)"
                            width="33px"
                            height="33px"
                            viewBox="-1 0 19 19"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zm-3.587-4.05a.318.318 0 0 0-.317-.317H4.449a.317.317 0 0 0-.317.317v6.86a.866.866 0 0 0 .226.538l.816.8a.895.895 0 0 0 .543.222h6.796a.318.318 0 0 0 .317-.317zm-1.598 3.066a.318.318 0 0 1-.316.317h-4.87a.317.317 0 0 1-.317-.317V6.22a.317.317 0 0 1 .317-.317h4.87a.318.318 0 0 1 .316.317zm-.36 1.888v2.543a.318.318 0 0 1-.317.317H6.4a.318.318 0 0 1-.316-.317v-2.543a.317.317 0 0 1 .316-.316h4.155a.317.317 0 0 1 .316.316zm-3.15.486h-.876v1.591h.876z" />
                        </svg>
                    </button>
                    <button
                        onClick={revertChanges}
                        aria-label="Cancel">
                        <svg
                            id="CancelSVG"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="var(--background)"
                            width="33px"
                            height="33px"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                        </svg>
                    </button>
                </div>
                :
                <div className="Completed">
                    <svg
                        onClick={toggleCompleted}
                        viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                        <path style={{
                            fill: task.completed ? `var(--${color}-fill)` : `var(--background)`
                        }} d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#292D32" />
                    </svg>
                </div>
            }








        </div>
    )
}
// EXPORTS