import { useState, useEffect } from 'react';
import { Fluence} from '@fluencelabs/fluence';
import config from 'src/app.json';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerAppConfig} from 'src/_aqua/app';
import connectionContext from './connection';
import joinContext from './join';


const userList = {
    peer_id: config.services.user_list.node,
    service_id: config.services.user_list.id,
};

const UserListApp = {
    user_list: userList,
};

export default function Context({ children }) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isInActiveDay, setisInActiveDay] = useState<boolean>(false);

    async function connect() {
        try {
            await Fluence.start({ connectTo: krasnodar[5] });

            setIsConnected(true);

            ///Register UserList
            registerAppConfig({
                getApp: () => {
                    return UserListApp;
                },
            });


        } catch (err) {
            setIsConnected(false);
            console.log('Peer initialization failed', err);
        }
    }

 


    


    useEffect(() => {
        if (!isConnected) {
            connect();
        }
    }, [isConnected]);

    return (
        <connectionContext.Provider value={[isConnected, setIsConnected]}>
            <joinContext.Provider value={[isInActiveDay, setisInActiveDay]}>
                {children}</joinContext.Provider>
        </connectionContext.Provider>
    );
}
function upstr(upstr: any, string: any) {
    throw new Error('Function not implemented.');
}
