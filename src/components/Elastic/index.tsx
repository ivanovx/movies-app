import React from "react";
import axios from "axios";

import { ELASTIC_HOST, ELASTIC_USER, ELASTIC_PASSWORD } from '../../config';
import store from '../../hooks/store';

export const ElasticContext = React.createContext({
    token: null
});

export const useElastic = () => React.useContext(ElasticContext);

type Props = {
    children: React.ReactNode;
}

export default function ElasticProvider({ children }: Props) {
    const [token, setToken] = React.useState(store.get('token', null));

    React.useEffect(() => {
        const controller = new AbortController();
        
        axios.post(`${ELASTIC_HOST}/_security/oauth2/token`, {
            "grant_type" : "password",
            "username" : ELASTIC_USER,
            "password" : ELASTIC_PASSWORD
          }, {
            signal: controller.signal,
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

        return () => controller.abort();
    }, []);

    React.useEffect(() => {
        store.set('token', token);
    }, [token]);

    return <ElasticContext.Provider value={{token}}>{children}</ElasticContext.Provider>;
}