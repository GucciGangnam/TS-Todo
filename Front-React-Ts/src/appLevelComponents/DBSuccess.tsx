// IMPORTS 
// Styles 
import "./DBSuccess.css";



// COMPONENT 
interface DBSuccessProps {
    success: boolean;
}

export const DBSuccess: React.FC<DBSuccessProps> = ({ success }) => {

    return (
        <div className="DBSuccess" style={{ backgroundColor: success ? 'var(--green)' : 'var(--red)' }}>

            {/* Fail */}
            {success ? <svg width="50px" height="50px"
                viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>657</title>
                <defs>
                </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(1.000000, 0.000000)" fill="var(--background)">
                        <path d="M6.43,5 C9.98119094,5 13,3.83708138 13,2.5 C13,1.16291862 9.98119094,0 6.43,0 C2.87880906,0 0,1.16291862 0,2.5 C0,3.83708138 2.87880906,5 6.43,5 Z"
                        >
                        </path>
                        <path d="M6.494,9.919 C10.055,9.919 12.941,8.937 12.941,7.723 L12.941,4.377 C12.941,5.049 10.009,6.051 6.494,6.051 C2.979,6.051 0.047,5.049 0.047,4.377 L0.047,7.723 C0.047,8.937 2.934,9.919 6.494,9.919 L6.494,9.919 Z"
                        >
                        </path>
                        <rect x="10" y="13" width="4.915" height="0.957">
                        </rect>
                        <path d="M0.0160000001,9.444 L0.0160000001,12.713 C0.0160000001,13.901 2.903,14.859 6.463,14.859 C7.332,14.859 8.16,14.8 8.918,14.697 L8.918,11.958 L10.958,11.958 L10.958,10.52 C9.789,10.841 8.198,11.081 6.463,11.081 C2.947,11.08 0.0160000001,10.1 0.0160000001,9.444 L0.0160000001,9.444 Z"
                        >
                        </path>
                        <rect x="12" y="11" width="0.958" height="4.937" >
                        </rect>
                    </g>
                </g>
            </svg>
                :
                <svg width="50" height="50" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <title>636</title>
                    <defs>
                    </defs>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(2.000000, 0.000000)" fill="var(--background)">
                            <ellipse cx="6.43" cy="2.421" rx="6.43" ry="2.421">
                            </ellipse>
                            <path d="M8.575,11.832 L9.589,10.819 C8.658,10.978 7.592,11.08 6.463,11.08 C2.947,11.08 0.0160000001,10.1 0.0160000001,9.444 L0.0160000001,12.713 C0.0160000001,13.901 2.903,14.859 6.463,14.859 C7.391,14.859 8.272,14.793 9.068,14.675 L10.244,13.499 L8.575,11.832 L8.575,11.832 Z">
                            </path>
                            <path d="M6.494,9.919 C10.055,9.919 12.941,8.937 12.941,7.723 L12.941,4.377 C12.941,5.049 10.009,6.051 6.494,6.051 C2.979,6.051 0.047,5.049 0.047,4.377 L0.047,7.723 C0.047,8.937 2.934,9.919 6.494,9.919 L6.494,9.919 Z">
                            </path>
                            <path d="M14.991,11.799 L14.175,10.983 L12.473,12.686 L10.805,11.019 L9.99,11.832 L11.658,13.5 L9.973,15.186 L10.787,16.002 L12.474,14.315 L14.176,16.018 L14.991,15.204 L13.288,13.502 L14.991,11.799 Z">
                            </path>
                        </g>
                    </g>
                </svg>
            }

        </div>
    )
};