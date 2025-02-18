// IMPORTS 
// style
import "./Home.css";
// React 

// Redux
import { useSelector } from "react-redux";
import { selectUser, clearUser } from "../../redux/slices/userSlice";
import { selectLists, clearLists } from "../../redux/slices/listsSlice";
import { selectTasks, clearTasks } from "../../redux/slices/tasksSlice";
import { persistor } from "../../redux/store";
import { useDispatch } from 'react-redux';

// TYPES 

// COMPOENNETS 


// COMPOENENT
export const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    console.log(user)

    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(clearLists());
        dispatch(clearTasks());
        persistor.purge();
    };

    const allLists = useSelector(selectLists);




    return (
        <div className="Home">


            <div className="Title">All Lists</div>

            <form>
                <input
                    placeholder="Create New List"
                />
            </form>
            {/* Lists container */}
            <div className="ListsContainer">

                {allLists.map((list, index) => (
                    <div
                        key={list.id}
                        className="List"
                        style={{
                            background : `var(--${list.color})`,
                            '--delay': `${index * 0.05}s`, // Calculate delay based on index
                        } as React.CSSProperties} // Apply the delay inline using CSS custom properties
                    >
                        <div className="List-Title">{list.name}</div>
                        <div className="List-Task-Count">{list.task_count}</div>
                    </div>
                ))}

            </div>
            {/* End */}
            <button onClick={handleLogout}>Log out</button>


        </div>
    )
};