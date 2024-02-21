"use client";
import React, {useEffect, useState} from "react";
import styles from '../../../styles/PageMessenger.module.sass'
import axios from 'axios';
import { MdDelete,  MdEditDocument } from "react-icons/md";

export default function PageSettingsMessenger({params}) {

    const [messengerIds, setMessengerIds] = useState(JSON.parse(sessionStorage.getItem("MessengerIds")))
    const [pageID, setPageID] = useState(Number(params.messengerId))

    const [maxTextLength, setMaxTextLength] = useState(100)

    const [countButtons, setCountButtons] = useState(0)
    const [maxButtonsCount, setMaxButtonsCount] = useState(null)
    const [inlineMaxButtonsCount, setInlineMaxButtonsCount] = useState(null)
    const [errorMaxCountButtons, setErrorMaxCountButtons] = useState(false)

    const [maxButtonTextLength, setMaxButtonTextLength] = useState(null)
    const [inlineMaxButtonTextLength, setInlineMaxButtonTextLength] = useState(null)

    const [supportLinkButtons, setSupportLinkButtons] = useState(-1)
    const [inlineSupportLinkButtons, setInlineSupportLinkButtons] = useState(-1)

    const [indexEdit, setIndexEdit] = useState(null)
    const [channels, setChannels] = useState(null)
    const [displayMode, setDisplayMode] = useState('standard');
    const [keyboardType, setKeyboardType] = useState('quickResponse');
    const [buttonText, setButtonText] = useState('');
    const [buttonLink, setButtonLink] = useState('');
    const [buttons, setButtons] = React.useState([])
    const [updateId, setUpdateId] = useState(0);


    useEffect(() => {
        setCountButtons(buttons.filter(button => button.displayMode === displayMode).length)
    }, [buttons, displayMode]);


    useEffect(() => {
        axios
            .get(`/api/buttons/${pageID}`)
            .then((res) => {
                setButtons(res.data)
            })

        axios
            .get('/api/communicationType')
            .then((res) => {
                setChannels(res.data)
                setMaxTextLength(res.data[pageID].maxCharCount)
                setMaxButtonsCount(res.data[pageID].maxButtonsCount)
                setInlineMaxButtonsCount(res.data[pageID].inlineMaxButtonsCount)
                setMaxButtonTextLength(res.data[pageID].maxButtonTextLength)
                setInlineMaxButtonTextLength(res.data[pageID].inlineMaxButtonTextLength)
                setSupportLinkButtons(res.data[pageID].supportLinkButtons)
                setInlineSupportLinkButtons(res.data[pageID].inlineSupportLinkButtons)
            })
    }, []);


    const deleteButton = async (id, key) =>{
        if(id !== undefined){
            await axios
                .delete('/api/buttons', {
                    data:{
                        id: id
                    }
                })
                .then((response) => {
                    buttons.forEach((button, index)=>{
                        if(button.id === id){
                            setButtons([...buttons.slice(0, index), ...buttons.slice(index+1)])
                        }
                    })

                });
        }
        else {
            setButtons([...buttons.slice(0, key), ...buttons.slice(key+1)])
        }
    }


    const saveButtons = async () => {
        await axios
            .post('/api/buttons', buttons)
            .then((response) => {
                const data = response.data
                setButtons(data)
            });
    }


    const addButton = async () => {
        if ((displayMode === 'standard' && countButtons < maxButtonsCount) || (displayMode === 'inline' && countButtons < inlineMaxButtonsCount) || maxButtonsCount === -1){
            setButtons([...buttons, {
                // id: buttons.length,
                displayMode: displayMode,
                typeKeyboard: keyboardType,
                textButton: buttonText,
                textLinkButton: buttonLink,
                idCommunicationType: pageID
            }])
        }
        else{
            setErrorMaxCountButtons(true)
        }
    }


    const updateButton = async () => {
        const updBtn = {
            id: updateId,
            displayMode: displayMode,
            typeKeyboard: keyboardType,
            textButton: buttonText,
            textLinkButton: buttonLink,
            idCommunicationType: pageID
        }
        if (updateId !== undefined){
            await axios.put('/api/buttons', updBtn).then((response) => {
                buttons.forEach((button, index)=>{
                    button.id === updateId ? setButtons([...buttons.slice(0, index), updBtn,...buttons.slice(index+1)]) : null
                })
            });
        }
        else{
            buttons.filter(button => button.displayMode === displayMode)
                .forEach((button, index)=>{
                    indexEdit === index ? setButtons([...buttons.slice(0, index), updBtn,...buttons.slice(index+1)]) : null
            })
        }
    }


    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <p>Мессенджер: {channels !== null ? channels[pageID].name : ""}</p>
            </div>
            <div className={styles.blockFormMessenger}>
                <div className={styles.formMassage}>
                    <label className={styles.textMassage}>
                        <p>Текст сообщения:</p>
                        <input
                            maxLength={ maxTextLength !== null ? maxTextLength : 100}
                            type="text"
                            name="textButton"
                            value={buttonText}
                            onChange={(e) => {
                                setButtonText(e.target.value)
                            }} />
                    </label>

                    {keyboardType === 'link' && (
                        <label className={styles.textMassage}>
                            <p>Ссылка кнопки:</p>
                            <input
                                type="text"
                                name="textLink"
                                value={buttonLink}
                                onChange={(e) => setButtonLink(e.target.value)} />
                        </label>
                    )}

                    <label className={styles.displayMode}>
                        <p>Режим отображения клавиатуры:</p>
                        <select
                            value={displayMode}
                            onChange={(e) => setDisplayMode(e.target.value)}>
                            <option value="standard">Стандартное отображение</option>
                            <option value="inline">Inline-отображение</option>
                        </select>
                    </label>

                    {((displayMode === 'standard' && supportLinkButtons === -1 ) || (displayMode === 'inline' && inlineSupportLinkButtons === -1 ) ||
                            (displayMode === 'standard' && supportLinkButtons === 1 ) || (displayMode === 'inline' && inlineSupportLinkButtons === 1 )) &&
                        <div className={styles.keyboardSettings}>
                            <p>Найстроики клавиатуры</p>
                            <label>
                                Тип клавиатуры:
                                            <select value={keyboardType} onChange={(e) => {
                                                    setKeyboardType(e.target.value)
                                                    e.target.value === "link" ? setButtonLink("") : ''
                                                }
                                            }>
                                                <option value="quickResponse" onChange={e => setButtonLink("")}>Быстрый ответ</option>
                                                <option value="link">Ссылка</option>
                                            </select>
                            </label>
                        </div>
                    }

                    {(buttons.length !== 0) &&
                        <div className="">
                            <div className=""><p>Кнопки:</p></div>
                            {buttons
                                .filter(button => button.displayMode === displayMode)
                                .map((button, key)=>{

                                    return(
                                        <div key={key}>
                                            <input
                                                type={"text"}
                                                className={styles.inputBtns}
                                                // type={button.displayMode === displayMode? "text" : "hidden"}
                                                value={button.textButton}
                                                readOnly={true}
                                                size={button.displayMode === 'standart' ? maxButtonTextLength : inlineMaxButtonTextLength}
                                                maxLength={button.displayMode === 'standart' ? maxButtonTextLength : inlineMaxButtonTextLength}
                                            />
                                            <MdEditDocument className={styles.btnEdit} onClick={e=>{
                                                setButtonText(button.textButton)
                                                setKeyboardType(button.typeKeyboard)
                                                setButtonLink(button.textLinkButton)
                                                setUpdateId(button.id)
                                                setIndexEdit(key)
                                            }} />
                                            <MdDelete className={styles.btnDel} onClick={e => deleteButton(button.id, key)} />
                                        </div>
                                    )
                                })}
                        </div>
                    }

                    {(errorMaxCountButtons) &&
                        <div className="error">
                            <p>Превышено максимальное количество кнопок</p>
                        </div>
                    }

                    <button type="submit" onClick={addButton}>Создать кнопку</button>
                    <button type="submit" onClick={updateButton}>Сохранить редактирование</button>
                    <button type={"submit"} onClick={saveButtons}>Сохранить</button>
                    <button type={"submit"}>Отправить сообщение</button>
                </div>
            </div>
        </div>
    )
}
