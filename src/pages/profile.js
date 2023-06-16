import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { auth, db } from '../pages/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onValue, ref, get } from 'firebase/database';
import Header from '@/components/header';
import Head from "next/head";

export default function Profile() {
    const [user, setUser] = useAuthState(auth);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);

    const googleAuth = new GoogleAuthProvider();

    const login = async () => {
        const results = await signInWithPopup(auth, googleAuth);
        const { user } = results;
        const userInfo = {
            name: user.displayName,
            email: user.email
        }
    }

    useEffect(() => {
        console.log(user);
        if (user) {
            const pointsRef = ref(db, `profile/${user.uid}/points`);
            onValue(pointsRef, (snapshot) => {
                const pointsValue = snapshot.val();
                if (pointsValue !== null) {
                    setPoints(pointsValue);
                }
            });
        }
    }, [user]);

    const handleClick = () => {
        window.open(user.photoURL, "_blank");
    };

    useEffect(() => {
        const calculateLevel = () => {
            const newLevel = Math.floor(points / 100) + 1;
            setLevel(newLevel);
        };

        calculateLevel();
    }, [points]);

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <Header />
            <div className="py-4 px-8 min-h-screen bg-black">
                {user && (
                    <div className="border border-white text-white shadow-lg rounded-3xl mx-auto p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <img
                            className="rounded-full h-24 w-24 sm:h-16 sm:w-16 mx-auto border cursor-pointer border-white mb-4 animate-pulse"
                            src={user.photoURL}
                            alt="Profile picture"
                            onClick={handleClick}
                        />
                        <div className="text-center sm:text-left">
                            <p className="mb-2 font-bold font-mono text-lg sm:text-3xl">
                                Name:{" "}
                                <span className="text-xl text-gray-300">{user.displayName}</span>
                            </p>
                            <p className="mb-2 font-bold font-mono text-lg sm:text-3xl">
                                Email:
                                <span className="text-xl text-gray-300"> {user.email}</span>
                            </p>
                        </div>
                    </div>
                )}

                

                <div className="mt-8 border border-white rounded-lg p-4 bg-gray-900 bg-opacity-80">
                    <div className="w-full h-4 bg-gray-500 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all duration-500 animate-pulse" style={{ width: `${points % 100}%` }}></div>
                    </div>
                    <p className="text-white text-lg font-bold">Points: {points}</p>

                    <div className="mt-4">
                        <div className="w-full h-4 bg-gray-500 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${((points % 100) / 100) * 100}%` }}></div>
                        </div>
                        <p className="text-white text-lg font-bold">Level: {level}</p>
                    </div>
                </div>
            </div>
        </>


    );
}
