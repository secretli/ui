import {KeySet} from "../../libs/encryption";
import {useRef} from "react";

export function Share() {
    let inputRef = useRef<HTMLTextAreaElement>(null)
    let outputRef = useRef<HTMLAnchorElement>(null)
    let outputRef2 = useRef<HTMLAnchorElement>(null)

    async function doWork() {
        if (inputRef.current === null || outputRef.current === null || outputRef2.current === null) {
            return
        }

        let keySet = await KeySet.NewRandomKeySet()
        let encodedKeySet = keySet.getEncodedKeySet()
        let encryptedData = await keySet.encrypt(inputRef.current.value)

        let response = await fetch("/s/api/secret", {
            method: 'POST',
            body: JSON.stringify({
                public_id: encodedKeySet.publicID,
                retrieval_token: encodedKeySet.retrievalToken,
                deletion_token: encodedKeySet.deletionToken,
                nonce: encryptedData.nonce,
                encrypted_data: encryptedData.encrypted_data,
                expiration: '7d',
                burn_after_read: false,
            }),
        })

        console.log(response)

        outputRef.current.href = `/s#${encodedKeySet.shareSecret}`
        outputRef.current.innerText = encodedKeySet.shareSecret

        outputRef2.current.innerText = encodedKeySet.deletionToken
    }

    return <div className="App">
        <h1>Share Secreti!</h1>
        <textarea ref={inputRef} rows={20} cols={80}></textarea>
        <div>
            <button onClick={doWork}>Share</button>
        </div>
        <div style={{paddingTop: "1em"}}>
            <a ref={outputRef} />
        </div>
        <div style={{paddingTop: "1em"}}>
            <a ref={outputRef2} />
        </div>
    </div>
}
