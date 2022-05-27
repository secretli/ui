import "./Retrieve.css";
import {EncryptedData, KeySet} from "../../libs/encryption";
import {useEffect, useState} from "react";

interface RetrieveProps {
    shareSecret: string
}

export function Retrieve(props: RetrieveProps) {
    const [shareSecret, setShareSecret] = useState(props.shareSecret)
    const [output, setOutput] = useState('')

    useEffect(() => {
        setShareSecret(props.shareSecret)
        setOutput('')
    }, [props.shareSecret])

    async function doWork(shareSecret: string) {
        let keySet = await KeySet.KeySetFromString(shareSecret)
        let encodedKeySet = keySet.getEncodedKeySet()

        let response = await fetch(`https://gphrase.de/s/api/secret/${encodedKeySet.publicID}`, {
            method: 'POST',
            headers: {
                'X-Retrieval-Token': encodedKeySet.retrievalToken,
            }
        })

        let data = (await response.json()) as EncryptedData
        let plain = await keySet.decrypt(data);

        setOutput(plain)
    }

    let inputVariant;
    if (props.shareSecret) {
        inputVariant = <div><p>{shareSecret}</p></div>
    } else {
        inputVariant = <div style={{padding: "1em"}}><input style={{width: "60ch", textAlign: "center"}} onInput={e => setShareSecret((e.target as HTMLInputElement).value)} /></div>
    }

    return <div className="App">
        <h1>Retrieve Secretli</h1>
        <p>Do you want to retrieve the secret?</p>
        {inputVariant}
        <textarea rows={20} cols={80} value={output} readOnly></textarea>
        <div style={{paddingTop: "2em"}}>
            <button onClick={() => doWork(shareSecret)}>Retrieve</button>
        </div>
    </div>
}
