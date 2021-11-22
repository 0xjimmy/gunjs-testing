<script lang="ts">
  import { each } from "svelte/internal";
  import { connectWallet, walletAddress, user, db } from "./user";

  let chatMessage: string = "";
  const sendMessage = () => {
    if (chatMessage) {
      db.get("chat").set(chatMessage);
      chatMessage = "";
    }
  };

  let chat = [];

  db.get("chat")
    .map()
    .on((data, key) => {
      chat = [...chat, data];
      /* data.map(console.log); */
      console.log({ data, key, chat });
    });
</script>

<main>
  <h1>Ethereum</h1>
  <h2>
    Wallet Address: {$walletAddress}
  </h2>
  <button on:click={connectWallet}>Connect Wallet</button>
  <h1>GunJS</h1>

  <input placeholder="Chat" bind:value={chatMessage} />
  <button on:click={sendMessage}>Send</button>
  <ul>
    {#each chat as message}
      <li>{message}</li>
    {/each}
  </ul>
</main>
