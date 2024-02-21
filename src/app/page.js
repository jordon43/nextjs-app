"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from '../styles/Home.module.sass'
import axios from "axios";


export default function Home() {

    const router = useRouter()
    const [nowChannels, setNowChannels] = useState([false, false, false, false])
    const [channels, setChannels] = useState([])
    const [flagError, setFlagError] = useState(false)


    const handleClick = () => {
        let takeMessenger = []
        for(let i =0; i<nowChannels.length;i++) nowChannels[i]===true ? takeMessenger.push(i) : null
        sessionStorage.setItem("MessengerIds", JSON.stringify(takeMessenger))
        if (takeMessenger.length === 0){
            setFlagError(true)
        } else {
            router.push("page-settings-messenger/"+takeMessenger[0])
        }
    }


    useEffect(() => {
        axios.get('/api/communicationType')
            .then((res)=>{
                setChannels(res.data)
            })
    }, []);


    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>HOME</h1>
            </div>
            <div className={styles.blockChangeMessenger}>
                <p>Выберите мессенджеры и социальные сети:</p>
                {channels.map((channel, key) =>(
                    <div className={styles.blockMessenger} key={key}>
                        <input
                            type="checkbox"
                            id={key}
                            defaultChecked={nowChannels[key]}
                            onChange = {e => setNowChannels([...nowChannels.slice(0, key), e.target.checked, ...nowChannels.slice(key+1)])}
                        />
                        <label htmlFor={key}>
                            {channel.name}
                        </label>
                    </div>

                ))}

                <div className={styles.blockBtn}>
                    <button onClick={handleClick}>Перейти</button>
                </div>

                {(flagError) &&
                    <div className="error">
                        <p>Выберите хотя бы один мессенджер</p>
                    </div>
                }

            </div>
        </div>
    )
}