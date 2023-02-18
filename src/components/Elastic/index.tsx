import React from "react";
import axios from "axios";

import { ELASTIC_HOST, ELASTIC_USER, ELASTIC_PASSWORD } from '../../config';

import useSorage from "../../hooks/store";

export const ElasticContext = React.createContext({
    token: null
});

export const useElastic = () => React.useContext(ElasticContext);

type Props = {
    children: React.ReactNode;
}

export default function ElasticProvider({ children }: Props) {
    const storage = useSorage('token');

    const [token, setToken] = React.useState<string | null>(storage.get());

    React.useEffect(() => {
        const abortController = new AbortController();
        
        axios.post(`${ELASTIC_HOST}/_security/oauth2/token`, {
            "grant_type" : "password",
            "username" : ELASTIC_USER,
            "password" : ELASTIC_PASSWORD
          }, {
            signal: abortController.signal,
            auth: {
                username: ELASTIC_USER,
                password: ELASTIC_PASSWORD
            }
        }).then((res: any) => {
            const { access_token } = res.data;
            setToken(access_token);
        }).catch((err: any) => {
            console.log(err);
        });

        return () => abortController.abort();
    }, []);

    React.useEffect(() => {
        storage.set(token);
    }, [token]);

    return <ElasticContext.Provider value={{token}}>{children}</ElasticContext.Provider>;
}