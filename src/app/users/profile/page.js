'use client'
import { useState, useEffect } from 'react';
import style from '../../styles/Explore.module.css'
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/navigation';
import handleLogout from '@/app/utils/handleLogout';
import axios from 'axios';
import setAuthToken from '@/app/utils/setAuthToken';
import ProfileSidebar from './profileSidebar'
import Profile from './profile';
import Results from '@/app/components/Results';


export default function Page() {
    // state is what the data is representing in realtime
    const router = useRouter();
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [resultsKey, setResultsKey] = useState(1); // Start counting at 1
    const [activeView, setActiveView] = useState('');
    const resultsLength = 20;

    const handleMain = (selectedView) => {
        setActiveView(selectedView);
        setResultsKey(resultsKey + 1);
      };
    

    const expirationTime = new Date(parseInt(localStorage.getItem('expiration')) * 1000);
    let currentTime = Date.now();

    // make a condition that compares exp and current time
    if (currentTime >= expirationTime) {
        handleLogout();
        alert('Session has ended. Please login to continue.');
        router.push('/');
    }

    useEffect(() => {
        setAuthToken(localStorage.getItem('jwtToken'));
        if (localStorage.getItem('jwtToken')) {
            axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/email/${localStorage.getItem('email')}`)
                .then((response) => {
                    // data is an object
                    let userData = jwtDecode(localStorage.getItem('jwtToken'));
                    if (userData.email === localStorage.getItem('email')) {
                        setData(response.data);
                        setLoading(false);
                    } else {
                        router.push('/users/login');
                    }

                })
                .catch((error) => {
                    console.log('error', error);
                    router.push('/users/login');
                });
        } else {
            router.push('/users/login');
        }
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No data shown...</p>;
    const renderContent = () => {
        if (activeView === 'Watch List') {
            return (
              <div>watchlist</div>
            );
        } else if (activeView === 'Popular') {
            return (
                <Results
                    key={resultsKey}
                    resultsLength={resultsLength}
                    resultsRoute="/movies/popular"
                    toggleFilter={toggleFilter}
                />
            );
        } else if (activeView === 'Top Rated') {
            return (
                <Results
                    key={resultsKey}
                    resultsLength={resultsLength}
                    resultsRoute="/movies/top-rated"
                    toggleFilter={toggleFilter}
                />
            );
        } else if (activeView === 'Upcoming') {
            return (
                <Results
                    key={resultsKey}
                    resultsLength={resultsLength}
                    resultsRoute="/movies/upcoming"
                    toggleFilter={toggleFilter}
                />
            );
        }
    };
    return (
        <div className={style.container}>
            <div className={style.sidebar}>
                <ProfileSidebar handleMain={handleMain} dataProp={data.userData} />
            </div>
            <div className={style.main}>
                {renderContent()}
                <Profile dataProp={data.userData} />
            </div>
        </div>

    )
}