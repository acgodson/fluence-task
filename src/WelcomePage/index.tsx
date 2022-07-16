import { Fluence } from '@fluencelabs/fluence';
import { CheckResponse, withErrorHandlingAsync } from '../components/handlers';
import { joinNew } from 'src/_aqua/app';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import illustration from './Img/illustration.svg';
import Modal from 'src/components/Modal';
import connectionContext from 'src/Contexts/connection';
import buzz from '../WelcomePage/Img/buzz.gif';
import count from '../WelcomePage/Img/score.gif';
import share from '../WelcomePage/Img/share.gif';
import joinContext from 'src/Contexts/join';



const HomePage = () => {
    const isConnected = useContext(connectionContext);
    const [isInActiveDay, setisInActiveDay] = useContext(joinContext);
    const [name, setName] = useState('');
    const [loginModalShowing, setLoginModalShowing] = useState(false);
    const navigate = useNavigate();
    function toggleLoginModal() {
        if (loginModalShowing) {
            setLoginModalShowing(false);
        } else {
            setLoginModalShowing(true);
        }
    }

    async function joinNewDay() {
        if (isConnected && name) {
            await withErrorHandlingAsync(async () => {
                const res = await joinNew({
                    peer_id: Fluence.getStatus().peerId!,
                    relay_id: Fluence.getStatus().relayPeerId!,
                    name: name,
                });
                if (CheckResponse(res)) {
                    setisInActiveDay(true);
                }
            });
        } else {
            return;
        }
    }

  

    useEffect(() => {
        if (isInActiveDay) {
            navigate('/dashboard', { state: { name: name } });
        }
    }, [isInActiveDay, name, navigate]);

    return (
        <div>
            <div className="nav-bar">
                <div>
                    <p className="logo-nav">
                        Fluence<span>Task</span>
                    </p>
                </div>

                <div>
                    <nav>
                        <ul className="second-nav">
                            <li className="go-premium-cta">
                                <p>Join </p>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <section className="hero">
                <div className="container">
                    <div className="left-col">
                        <p className="sub-head">
                            Welcome to <span>FluenceTask</span>
                        </p>
                        <h1>Commit your daily habits to Tasks that promote sustainability</h1>

                        <div className="hero-cta">
                            <button className="primery-cta" onClick={() => setLoginModalShowing(true)}>
                                GET STARTED
                            </button>
                        </div>
                    </div>

                    <img src={illustration} alt="Illustration" className="hero-img" />
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <ul>
                        <li>Turn Off the Light</li>

                        <li> Skip the Dryer</li>
                        <li>Rcycle Plastic</li>
                        <li>Ride a Bike</li>
                        <li>Wash Cold</li>
                        <li>Plant Trees</li>
                    </ul>
                    <div>
                        <div className="circle">{/* <img src={holdingPhone} alt="phone" />  */}</div>
                    </div>
                </div>
            </section>

            <section className="others test-monials-section" style={{ overflowX: 'hidden' }}>
                <div className="container">
                    <ul className="mobis">
                        {/* <!--PERSON 1--> */}
                        <li>
                            <img src={buzz} alt="Person 1" />

                            <p>
                                <span>Check In</span> tasks whenever you complete them in real life
                            </p>
                        </li>

                        {/* <!--PERSON 2--> */}
                        <li>
                            <img src={count} alt="Person 2" />

                            <p>
                                <span>Track </span>your daily scores and be motivated to get better everyday
                            </p>
                        </li>

                        {/* <!--PERSON 3--> */}
                        <li>
                            <img src={share} alt="Person 3" />
                            <p>
                                <span>Be inspired</span> by scores reached by those around you and also invite friends at
                                home or work to join in the campaign
                            </p>
                        </li>
                    </ul>
                </div>
            </section>

            {loginModalShowing && (
                <Modal
                    closeModal={toggleLoginModal}
                    big
                    style={{
                        top: '10vh',
                        maxHeight: '100%',
                        minHeight: 'fit-content',
                        borderRadius: '15px',
                        left: '0',
                        right: '0',
                        width: '95%',
                        zIndex: '999999',
                    }}
                >
                    {!isConnected ? (
                        <div className="zero-state">
                            <div>waiting for Connection</div>
                        </div>
                    ) : (
                        <div className="container" id="join">
                            <div className="center">
                                <h3
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >
                                    Let's Save Earth
                                </h3>
                                <label>Display Name (Required)</label>
                                <input
                                    id="createPassword"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(x) => setName(x.target.value)}
                                    placeholder="Input name"
                                    required
                                />
                                <br />
                                <br />

                                <button
                                    type="submit"
                                    disabled={!name ? true : false}
                                    className="submit"
                                    onClick={() => {
                                        joinNewDay();
                                    }}
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default HomePage;
