import { useEffect, useState } from 'react';

import { withErrorHandlingAsync } from './handlers';
import { initAfterJoin, updateOnlineStatuses } from 'src/_aqua/app';
import { registerUserStatus } from 'src/_aqua/app';
import { CallParams, Fluence, PeerIdB58 } from '@fluencelabs/fluence';

interface User {
    id: PeerIdB58;
    name: string;
    isOnline: boolean;
    score: string;
}

const refreshOnlineStatusTimeoutMs = 10000;

export const UserList = (props: { selfName: string; score: string }) => {
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

    useEffect(() => {
        const listRefreshTimer = setInterval(() => {
            withErrorHandlingAsync(async () => {
                await updateOnlineStatuses();
            });
        }, refreshOnlineStatusTimeoutMs);

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
                        score: props.score,
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
        });

        withErrorHandlingAsync(async () => {
            await initAfterJoin({
                name: props.selfName,
                peer_id: Fluence.getStatus().peerId!,
                relay_id: Fluence.getStatus().relayPeerId!,
            });
        });

        return () => {
            clearTimeout(listRefreshTimer);
        };
    },);

    const usersArray = Array.from(users)
        .map((x) => x[1])
        .sort((a, b) => a.name.localeCompare(b.name)).filter((x) => x.isOnline);

    return (

        <div className="userlist">
            <ul>
                {usersArray.map((x) => (
                    <li key={x.id}>
                        <span style={{ fontWeight: x.id === Fluence.getStatus().peerId ? 'bold' : '' }}>{x.name }</span>
                        <span style={{ color: x.isOnline ? 'green' : 'red' }}>
                            {' '}
                            ({x.isOnline ? 'online' : 'offline'})
                        </span>
                        <span style={{ fontWeight: 'bold' }}>{x.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
