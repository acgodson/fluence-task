import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withErrorHandlingAsync } from 'src/components/handlers';
import styles from './styles.module.css';
import 'react-pro-sidebar/dist/css/styles.css';
import Tiles from 'src/components/Tiles';
import Modal from 'src/components/Modal';
import joinContext from 'src/Contexts/join';
import connectionContext from 'src/Contexts/connection';
import { UserList } from 'src/components/userList';
import { leave} from 'src/_aqua/app';
import { getRelayTime, registerUserScores, tellFortune } from 'src/_aqua/user-scores';
import bulb from '../WelcomePage/Img/bulb.jpg';
import rope from '../WelcomePage/Img/rope.jpg';
import recycle from '../WelcomePage/Img/recycle.jpg';
import bike from '../WelcomePage/Img/bike.jpg';
import laundry from '../WelcomePage/Img/laundry.jpg';
import plant from '../WelcomePage/Img/plant.jpg';
import menu from '../WelcomePage/Img/menu.svg';
import { toast } from 'react-toastify';
import {
    faLightbulb,
    faHandsWash,
    faRecycle,
    faBiking,
    faTemperature0,
    faPlantWilt,
} from '@fortawesome/free-solid-svg-icons';

type locationState = {
    name: string;
};

const Tasks = [
    {
        cover: bulb,
        icon: faLightbulb,
        title: 'Turn Off the Light',
        subtitle:
            'remember, to turn of the Light as soon as you leave the room. Hit the button once you take the action in real-life',
        score: 3,
    },
    {
        cover: rope,
        icon: faHandsWash,
        title: 'Skip the Dryer',
        subtitle: 'save money with lasting clothes. Dry them outdoors on the clothelines or drying rack',
        score: 3,
    },
    {
        cover: recycle,
        icon: faRecycle,
        title: 'Recycle Plastic',
        subtitle: 'make sure paper, bottles, and other non-trash get to the bin where they belong',
        score: 5,
    },
    {
        cover: bike,
        icon: faBiking,
        title: 'Ride a Bike',
        subtitle: 'take a bike to your destination instead of driving though busy traffics.',
        score: 5,
    },
    {
        cover: laundry,
        icon: faTemperature0,
        title: 'Wash Cold',
        subtitle: "don't use the hot wash on the machine. Stains can still leave without heating up materials",
        score: 2,
    },
    {
        cover: plant,
        icon: faPlantWilt,
        title: 'Plant New Seedlings',
        subtitle: 'Plant a new flower or tre seedlings in yor yard. Good for nature',
        score: 8,
    },
];

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as locationState;
    const displayName = state.name;
    const isConnected = useContext(connectionContext);
    const [isInActiveDay, setisInActiveDay] = useContext(joinContext);
    const [mobileModal, setMobileModal] = useState<boolean>(false);
    const [buzzModal, setBuzzModal] = useState<boolean>(false);
    const [buzzPoint, setBuzzPoint] = useState<number>(0);
    const [scores, setScores] = useState<number[]>([0]);
    const [totalScore, setTotalScore] = useState<string>('0');
    const [values, setValues] = useState({
        title: '',
        subtitle: '',
        score: '',
    });

    function toggleBuzzModal() {
        if (buzzModal) {
            setBuzzModal(false);
        } else {
            setBuzzModal(true);
        }
    }
    function toggleMobileModal() {
        if (mobileModal) {
            setMobileModal(false);
        } else {
            setMobileModal(true);
        }
    }

    function handleSubmit() {
        if (values.score) {
            setBuzzPoint(parseInt(values.score));
            setBuzzModal(false);
        }
    }

    const leaveTask = async () => {
        if (!isConnected) {
            return;
        }

        await withErrorHandlingAsync(async () => {
            await leave();
            setisInActiveDay(false);
        });
    };

    async function updateScores() {
        try {
            //   if (isInActiveDay) {
            registerUserScores({
                getFortune: async () => {
                    await new Promise((resolve) => {
                        setTimeout(resolve, 1000);
                    });
                    
                    return scores;
                },
            });

            const _scores = await tellFortune();
            const relayTime = await getRelayTime();
            setScores(_scores);
           

            console.log(_scores);

        } catch (err) {
            console.log('Peer initialization failed', err);
        }
    }

    useEffect(() => {
        if (!buzzModal && parseInt(totalScore) !== 0) {
            updateScores();
            toast.success(`Keep it up you've just earned ${totalScore} points`);
        }
    }, [buzzModal, totalScore]);

    useEffect(() => {
        if (!isInActiveDay) {
            navigate('/');
        }
    }, [isInActiveDay, navigate]);

    return (
        <>
            <div className={styles.nav_bar}>
                <div className={styles.top_menu}> 
                    <p className={styles.logo_nav}>
                        Fluence<span>Task</span>
                    </p>
                </div>

                <div>
                    <div className={styles.mobile_menu}>
                        <ul className={styles.second_nav}>
                            <li>
                                {' '}
                                <button
                                    style={{
                                        background: 'green',
                                        border: 'none',
                                        borderRadius: '6px',
                                        height: '45px',
                                        width: '45px',
                                    }}
                                    onClick={() => setMobileModal(true)}
                                >
                                    <img src={menu} alt="menu" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    <nav>
                        <ul className={styles.second_nav}>
                            <p>
                                Connection status:{' '}
                                {isConnected ? <span className="accent">connected</span> : 'disconnected'}
                            </p>
                        </ul>
                    </nav>
                </div>
            </div>

            <div>
                <div className={styles.side_bar}>
                <div className={styles.top_menu}> 
                    <p className={styles.logo_nav}>
                        Fluence<span>Task</span>
                    </p>
                                 <button className={styles.side_button} onClick={() => leaveTask()}>Leave</button>
                     
                </div>
                   

                    <UserList selfName={displayName} score={totalScore!.toString()} />
                </div>

                {mobileModal && (
                    <Modal
                        style={{
                            top: '10vh',
                            minHeight: 'fit-content',
                            borderRadius: '15px',
                            backgroundColor: 'white',
                            overflowY: 'hidden',
                            left: '0',
                            right: '0',
                            width: '95%',
                            zIndex: '999999',
                        }}
                        big
                        closeModal={toggleMobileModal}
                    >
                        <div className={styles.mobile_bar}>
                            <label>Scores </label>
                            <UserList selfName={displayName} score={totalScore!.toString()} />
                            <span>
                                <button onClick={() => leaveTask()}>Leave</button>
                            </span>
                        </div>
                    </Modal>
                )}

                <div className={styles.categories}>
                    {Tasks.map((tasks, i) => (
                        <>
                            <Tiles
                                click={() => {
                                    setValues({
                                        title: tasks.title,
                                        subtitle: tasks.subtitle,
                                        score: tasks.score.toString(),
                                    });
                                    setBuzzModal(true);
                                }}
                                icon={tasks.icon}
                                cover={tasks.cover}
                                title={tasks.title}
                                subtitle={tasks.subtitle}
                                keys={tasks.title + i}
                            />
                        </>
                    ))}
                </div>

                {buzzModal && (
                    <Modal
                        style={{
                            top: '10vh',
                            minHeight: 'fit-content',
                            borderRadius: '15px',
                            backgroundColor: 'white',
                            overflowY: 'hidden',
                            left: '0',
                            right: '0',
                            width: '95%',
                            zIndex: '999999',
                        }}
                        big
                        closeModal={toggleBuzzModal}
                    >
                        <div className={styles.modal_top}>
                            <h2> {values.title}</h2>
                            <h2>
                                {values.score} <span>Points</span>
                            </h2>
                        </div>
                        <div className={styles.modal_body}>
                            <p>For this Action, {values.subtitle}</p>
                            <button
                                type="submit"
                                className="submit"
                                onClick={() => {
                                    handleSubmit();
                                    setScores([...scores, buzzPoint]);
                                    setTotalScore(scores.reduce((a: number, b: number) => a + b).toString());
                                }}
                            >
                                Check Action
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </>
    );
};

export default Dashboard;
