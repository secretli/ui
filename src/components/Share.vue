<script lang="ts">
import { KeySet } from "@/libs/encryption";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      input: "",
      shareLink: "",
      shareSecret: "",
      deletionToken: "",
    };
  },
  methods: {
    async doWork() {
      let keySet = await KeySet.NewRandomKeySet();
      let encodedKeySet = keySet.getEncodedKeySet();
      let encryptedData = await keySet.encrypt(this.input.toString());

      let response = await fetch("/s/api/secret", {
        method: "POST",
        body: JSON.stringify({
          public_id: encodedKeySet.publicID,
          retrieval_token: encodedKeySet.retrievalToken,
          deletion_token: encodedKeySet.deletionToken,
          nonce: encryptedData.nonce,
          encrypted_data: encryptedData.encrypted_data,
          expiration: "7d",
          burn_after_read: false,
        }),
      });

      console.log(response);

      this.shareLink = `/s#${encodedKeySet.shareSecret}`;
      this.shareSecret = encodedKeySet.shareSecret;
      this.deletionToken = encodedKeySet.deletionToken;
    },
  },
});
</script>

<template>
  <h1>Share Secretli!</h1>

  <textarea v-model="input" rows="20" cols="80"></textarea>

  <div>
    <button @click="doWork">Share</button>
  </div>

  <div>
    <a v-if="shareLink" :href="shareLink">{{ shareSecret }}</a>
    <p v-if="deletionToken">{{ deletionToken }}</p>
  </div>
</template>

<style>
div {
  padding: 1em;
}
</style>
