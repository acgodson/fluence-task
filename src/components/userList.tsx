import { useEffect, useState } from 'react';

import { withErrorHandlingAsync } from './utils';
import { initAfterJoin, updateOnlineStatuses } from 'src/_aqua/app';
import { registerUserStatus } from 'src/_aqua/app';
import { CallParams, Fluence, PeerIdB58 } from '@fluencelabs/fluence';

interface User {
    id: PeerIdB58;
    name: string;
    isOnline: boolean;
    score: string;
}


interface CalcDef {
    add: (n: number, callParams: CallParams<"n">) => void | Promise<void>;
    subtract: (n: number, callParams: CallParams<"n">) => void | Promise<void>;
    multiply: (n: number, callParams: CallParams<"n">) => void | Promise<void>;
    divide: (n: number, callParams: CallParams<"n">) => void | Promise<void>;
    reset: (callParams: CallParams<null>) => void | Promise<void>;
    getResult: (callParams: CallParams<null>) => number | Promise<number>;
  }

const refreshOnlineStatusTimeoutMs = 10000;

export const UserList = (props: { selfName: string; score: string }) => {
    const [users, setUsers] = useState<Map<PeerIdB58, User>>(new Map());
    // const [scores, setScores] = useState<Map<number, CalcDef>>(new Map());

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
                        score: score,
                        isOnline: true,
                    });

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
    }, [props.selfName, props.score]);

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
