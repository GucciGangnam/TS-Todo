// IMPORTS 
// Styles
import "./LoginSignup.css";
// React
import { useState } from "react";
// Redux 
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { setLists } from "../../redux/slices/listsSlice";
import { setTasks } from "../../redux/slices/tasksSlice";
// RRD 
import { useNavigate } from "react-router-dom";
// Components 
import { LoadingScreen } from "./LoadingScreen";
// Variables
const apiUrl = import.meta.env.VITE_API_URL;


// TYPES 


// COMPONENT
export const LoginSignup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Component States 
    const [formState, setFormState] = useState<'Signup' | 'Log in'>('Signup');
    const [loading, setLoading] = useState(false);

    // Toggle handler
    const handleChangeFormState = () => {
        if (formState == 'Log in') {
            setFormState('Signup')
        } else {
            setFormState('Log in')
        }
    }

    // Form States
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emailPlaceholder, setEmailPlaceholder] = useState('Email')
    const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password')

    // Handle Change States
    const handleChangeStateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Change Name Value
        if (e.target.name === 'name') {
            const formattedName = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
            setName(formattedName);
        }
        // Change Email Value
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        };
        // Change Password Value
        if (e.target.name === 'password') {
            setPassword(e.target.value);
        };
        // Change ConfirmPassword Value
        if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        };
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        e.target.setCustomValidity(value !== password ? "Passwords do not match" : "");
        setConfirmPassword(value);
    };
    // Form Submit
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((formState === "Signup") && (password !== confirmPassword)) {
            return;
        }
        setLoading(true);
        //////////////////////////////// IF SIGN UP
        if (formState === "Signup") {
            try {
                const res = await fetch(`${apiUrl}users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                    }),
                });
                const result = await res.json();
                if (!res.ok) {
                    console.error("Error response:", result); // Log full response
                    if (result.statusCode === 409) {
                        setEmailPlaceholder('Email already in use');
                        setEmail('');
                    } else
                        throw new Error(result.message || "Failed to fetch");
                } else {
                    setName('')
                    setPassword('')
                    setConfirmPassword('')
                    setFormState('Log in')
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
        }
        //////////////////////////////// IF LOGIN
        if (formState === "Log in") {
            try {
                const res = await fetch(`${apiUrl}auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });
                const result = await res.json();
                if (!res.ok) {
                    console.error("Error response:", result); // Log full response
                    if (result.statusCode === 401) {
                        setPassword('')
                        setPasswordPlaceholder("Incorrect password or email")
                    }
                    throw new Error(result.message || "Failed to fetch");
                } else {
                    setEmailPlaceholder("Email");
                    setPasswordPlaceholder("Password");
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    // Make user Data Object 
                    const userData = {
                        authToken: result.userData.authToken,
                        name: result.userData.user.name,
                        email: result.userData.user.email
                    }
                    const listData = result.userData.lists;
                    const taskData = result.userData.tasks;
                    // Save user Dtaa to redux
                    dispatch(setUser(userData));
                    dispatch(setLists(listData));
                    dispatch(setTasks(taskData));
                    navigate('/');
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
        }
    }

    //Demo Account
    const loginAsDemoUser = async() => { 
        let randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const randomString = Math.random().toString(36).substring(2, 8);
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `DemoUser${randomString}`,
                    email: `${randomString}@${randomString}.com`,
                    password: `${randomString}A1${randomNumber}`,
                }),
            });
            const result = await res.json();
            if (!res.ok) {
                console.error("Error response:", result); // Log full response
            } else { 
                /// Log user in 
                try {
                    const res = await fetch(`${apiUrl}auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: `${randomString}@${randomString}.com`,
                            password: `${randomString}A1${randomNumber}`,
                        }),
                    });
                    const result = await res.json();
                    if (!res.ok) {
                        console.error("Error response:", result); // Log full response
                        if (result.statusCode === 401) {
                            setPassword('')
                            setPasswordPlaceholder("Incorrect password or email")
                        }
                        throw new Error(result.message || "Failed to fetch");
                    } else {
                        setEmailPlaceholder("Email");
                        setPasswordPlaceholder("Password");
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        // Make user Data Object 
                        const userData = {
                            authToken: result.userData.authToken,
                            name: result.userData.user.name,
                            email: result.userData.user.email
                        }
                        const listData = result.userData.lists;
                        const taskData = result.userData.tasks;
                        // Save user Dtaa to redux
                        dispatch(setUser(userData));
                        dispatch(setLists(listData));
                        dispatch(setTasks(taskData));
                        navigate('/');
                    }
                } catch (err) {
                    console.error("Error fetching data:", err);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000)
                }
                // END log user in 
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }


    }

    return (

        <>
            {loading ?
                <LoadingScreen />
                :
                <div className="LoginSignup">
                    {/* Title */}
                    {/* Logo */}
                    <div className="Logo">
                        <img src="TypeScript.png" />
                        <div className="Title">ToDo</div>
                    </div>

                    {/* Toggle button */}
                    <div className="Toggle"
                        onClick={handleChangeFormState}
                    >
                        <button
                            id="Left"
                            style={{
                                backgroundColor: formState === 'Signup' ? 'var(--element-fill)' : ''
                            }}>
                            Sign up
                        </button>
                        <button
                            id="Right"
                            style={{
                                backgroundColor: formState === 'Log in' ? 'var(--element-fill)' : ''
                            }}>
                            Log in
                        </button>
                    </div>

                    {/* Form  */}
                    <form onSubmit={handleFormSubmit}>

                        <input
                            placeholder="Name"
                            className={formState === 'Signup' ? '' : 'Hidden'}
                            name="name"
                            value={name}
                            onChange={handleChangeStateValue}
                            type="text"
                            minLength={3}
                            maxLength={25}
                            disabled={formState === 'Signup' ? false : true}
                            required />

                        <input
                            placeholder={emailPlaceholder}
                            name="email"
                            type="email"
                            onChange={handleChangeStateValue}
                            value={email}
                            required />

                        <input
                            placeholder={passwordPlaceholder}
                            name="password"
                            value={password}
                            onChange={handleChangeStateValue}
                            type="password"
                            pattern="^(?=.*[A-Z])(?=.*\d).+$"
                            title="Password must 8 letters, include at least one uppercase letter and one number."
                            required />

                        <input
                            placeholder="Confirm Password"
                            className={formState === 'Signup' ? '' : 'Hidden'}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            type="password"
                            disabled={formState !== 'Signup'}
                            required
                        />

                        <button
                            style={{
                                marginTop: formState === 'Signup' ? '2vh' : '',
                            }}>
                            {formState}
                        </button>
                    </form>

                    <button onClick={loginAsDemoUser} className="Demo-Button">
                        Demo account
                    </button>

                </div>


            }

        </>



    )
}
