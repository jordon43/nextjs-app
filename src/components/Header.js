"use client"
import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from '../styles/Header.module.sass'
import axios from "axios";
import {useEffect, useState} from "react";



const Header = () => {
    const [channels, setChannels] = useState(null)
    useEffect(() => {
        axios
            .get('/api/communicationType')
            .then((res) => {
                setChannels(res.data)
            })
    }, []);

    const pathname = usePathname()
    const messengerIds = sessionStorage.getItem("MessengerIds")

    return (
        <header className={styles.header}>
            <nav>
                <Link href={"/"}>Home</Link>
                {channels? channels.map((channel, key)=>{
                    const isActive = pathname.startsWith("/page-settings-messenger/"+channel.id)
                    if (messengerIds.indexOf(channel.id) !== -1 ){
                        return(
                            <Link
                                href={channel.id.toString()}
                                key={key}
                                className={isActive ? styles.select_nav : ""}
                            >{channel.name}</Link>
                        )
                    }
                }) : null}
            </nav>
        </header>
    );
}

export default Header



