<script lang="ts">
import type { EncryptedData } from '@/libs/encryption';

import { defineComponent } from 'vue';
import { KeySet } from '@/libs/encryption';

export default defineComponent({
    data() {
        const initialShareSecret: String = this.initialShareSecret()

        return {
            output: '',
            shareSecret: initialShareSecret,
            shareSecretGiven: initialShareSecret != ''
        }
    },
    methods: {
        initialShareSecret(): String {
            if (this.$route.hash == '') {
                return ''
            }
            return this.$route.hash.substring(1)
        },
        async doWork(shareSecret: String) {
            let keySet = await KeySet.KeySetFromString(shareSecret.toString())
            let encodedKeySet = keySet.getEncodedKeySet()

            let response = await fetch(`https://gphrase.de/s/api/secret/${encodedKeySet.publicID}`, {
                method: 'POST',
                headers: {
                    'X-Retrieval-Token': encodedKeySet.retrievalToken,
                }
            })

            let data = (await response.json()) as EncryptedData
            let plain = await keySet.decrypt(data);

            this.output = plain
        }
    },
    watch: {
        '$route.hash'(_: String) {
            const secret = this.initialShareSecret()
            this.shareSecret = secret
            this.shareSecretGiven = secret != ''
        }
    }
})
</script>

<template>
    <h1>Retrieve Secretli!</h1>
    <p>Do you want to retrieve the secret?</p>

    <div>
        <input v-model="shareSecret" :disabled="shareSecretGiven"/>
    </div>

    <textarea rows="20" cols="80" v-model="output" readonly></textarea>

    <div>
        <button @click="doWork(shareSecret)">Retrieve</button>
    </div>
</template>

<style>
div {
    padding: 1em;
}

input {
    width: 60ch;
    text-align: center;
}
</style>
