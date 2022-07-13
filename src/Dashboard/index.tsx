import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withErrorHandlingAsync } from 'src/components/utils';
import { registerUserStatus } from 'src/_aqua/app';
import { PeerIdB58 } from '@fluencelabs/fluence';
import styles from './styles.module.css';
import 'react-pro-sidebar/dist/css/styles.css';
import Tiles from 'src/components/Tiles';
import Modal from 'src/components/Modal';
import joinContext from 'src/Contexts/join';
import connectionContext from 'src/Contexts/connection';
import { UserList } from 'src/components/userList';
import { leave } from 'src/_aqua/app';
import bulb from '../WelcomePage/Img/bulb.jpg';
import rope from '../WelcomePage/Img/rope.jpg';
import recycle from '../WelcomePage/Img/recycle.jpg';
import bike from '../WelcomePage/Img/bike.jpg';
import laundry from '../WelcomePage/Img/laundry.jpg';
import plant from '../WelcomePage/Img/plant.jpg';
import menu from '../WelcomePage/Img/menu.svg';
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

interface User {
    id: PeerIdB58;
    name: string;
    isOnline: boolean;
    score: string;
}

const Tasks = [
    {
        cover: bulb,
        icon: faLightbulb,
        title: 'Turn Off the Light',
        subtitle: 'Turn of the Light as soon as you leave the room',
        score: 3,
    },
    {
        cover: rope,
        icon: faHandsWash,
        title: 'Skip the Dryer',
        subtitle: 'Turn of the Light as soon as you leave the room',
        score: 3,
    },
    {
        cover: recycle,
        icon: faRecycle,
        title: 'Recycle Plastic',
        subtitle: 'Turn of the Light as soon as you leave the room',
        score: 5,
    },
    {
        cover: bike,
        icon: faBiking,
        title: 'Ride a Bike',
        subtitle: 'Turn of the Light as soon as you leave the room',
        score: 5,
    },
    {
        cover: laundry,
        icon: faTemperature0,
        title: 'Wash Cold',
        subtitle: 'Turn of the Light as soon as you leave the room',
        score: 2,
    },
    {
        cover: plant,
        icon: faPlantWilt,
        title: 'Plant New Seedlings',
        subtitle: 'Turn of the Light as soon as you leave the room',
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
    const [buzzModal, setBuzzModal] = useState<boolean>(false);
    const [buzzPoint, setBuzzPoint] = useState<number[]>(Tasks.map((x) => x.score));


    const [values, setValues] = useState({
        title: '',
        subtitle: '',
        score: '',
    });

    const [users, setUsers] = useState<Map<PeerIdB58, User>>(new Map());

    const updateOnlineStatus = (user: string, onlineStatus: boolean) => {
        setUsers((prev) => {
            const result = new Map(prev);
            const u = result.get(user);
            if (u) {
                result.set(user, { ...u, isOnline: onlineStatus });
            }
            return result;
        });
    };

    function toggleBuzzModal() {
        if (buzzModal) {
            setBuzzModal(false);
        } else {
            setBuzzModal(true);
        }
    }

    function handleSubmit() {
        if (values.score) {
            ///Add The number to the Users total Value,
            console.log(values.score);

            registerUserStatus({
                notifyOnline: (user, onlineStatus) => {
                    updateOnlineStatus(user, onlineStatus);
                },
                notifyUserAdded: (user, isOnline) => {
                    setUsers((prev) => {
                        const u = user;
                        const result = new Map(prev);
                        if (result.has(u.peer_id)) {
                            return result;
                        }

                        result.set(u.peer_id, {
                            name: u.name,
                            id: u.peer_id,
                            isOnline: isOnline,
                            score: values.score,
                        });

                        return result;
                    });
                },
                notifyUserRemoved: (userLeft) => {
                    setUsers((prev) => {
                        const result = new Map(prev);
                        result.delete(userLeft);
                        return result;
                    });
                },
                notifyScore: (user, score) => {
                    setUsers((prev) => {
                        const u = user;
                        const result = new Map(prev);
                        if (result.has(u.peer_id)) {
                            return result;
                        }

                        result.set(u.peer_id, {
                            name: u.name,
                            id: u.peer_id,
                            score: values.score,
                            isOnline: true,
                        });

                        return result;
                    });
                },
            });

            console.log('updated');
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

    useEffect(() => {
        ///Add new Score for User;
        console.log(buzzPoint);
    }, [buzzPoint]);

    useEffect(() => {
        if (!isInActiveDay) {
            navigate('/');
        }
    }, [isInActiveDay, navigate]);

    return (
        <>
            <div className={styles.nav_bar}>
                <div>
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
                    <label>
                        Scores{' '}
                        <span>
                            <button onClick={() => leaveTask()}>Leave</button>
                        </span>
                    </label>

                    <UserList selfName={displayName} score={values.score.toString()} />
                </div>

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
                            <button type="submit" className="submit" onClick={handleSubmit}>
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
