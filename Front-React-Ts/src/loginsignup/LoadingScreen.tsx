// IMPORTS 
// style
import "./LoadingScreen.css"
// React

// TYPES 

//COMPONENET
export const LoadingScreen = () => {
    return (
        <div className="LoadingScreen">

            <div className="Loader">
                <div className="Bar">
                </div>
                <div className="Circle">
                </div>
            </div>

            <div className="Message">Loading can take up to 1 minute to spin up server</div>



        </div>
    )
}