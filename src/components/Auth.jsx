import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userGoogle, setUserGoogle] = useState("");
    // console.log(userGoogle);

    const signIn = async (e) => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password).then((res) => {
            // console.log(res)
            setUserGoogle(res.user)
            setEmail("");
            setPassword("");
        }).catch((error) => {
            alert(error)
        })

    };

    const signInWithGoogle = async (e) => {
        e.preventDefault();
        await signInWithPopup(auth, googleProvider).then((res) => {
            // console.log(res);
            setUserGoogle(res.user);
        }).catch((error) => {
            alert(error)
        })
    }

    const logOut = async (e) => {
        e.preventDefault();
        await signOut(auth)
            .then(() => {
                setUserGoogle("");
            })
            .catch((error) => {
                alert(error);
            });
    }

    return (
        <>
            <form>
                <input
                    placeholder='Email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder='Password...'
                    value={password}
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={signIn}>Sign In </button>
                <button onClick={signInWithGoogle}>SignIn With Google</button>
                <button onClick={logOut}> Logout </button>

            </form>
            {userGoogle ? (
                <div>
                    <h1>Bienvenue</h1>{" "}
                    <img src={userGoogle.photoURL} alt={userGoogle.photoURL} style={{ borderRadius: '50%' }} />
                    <h2>{userGoogle.displayName}</h2>
                </div>) : ("")}

        </>
    );
};

export default Auth;
