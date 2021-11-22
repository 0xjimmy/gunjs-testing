import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { providers } from 'ethers';
import { writable, get } from 'svelte/store';

// Ethereum Connection 
export const provider = writable(null);
export const walletAddress = writable(null);

export function connectWallet() {
  window['ethereum'].request({ method: 'eth_requestAccounts' }).then(() => {
    const walletProvider = new providers.Web3Provider(window['ethereum']);
    provider.set(walletProvider.getSigner());
    walletProvider
      .getSigner()
      .getAddress()
      .then((address: string) => {
        walletAddress.set(address);
      });
  });
}

// Database
export const db = GUN('https://7a56-203-211-77-250.ngrok.io/gun');

// Gun User
export const user = db.user().recall({ sessionStorage: true });

walletAddress.subscribe(async (address: string) => {
  if (address) {
    // @ts-ignore
    if (!user.is) {
      try {
        await new Promise((resolve, reject) => user.auth(address, "securepass", (cb: { err: string }) => cb.err ? reject(cb.err) : resolve(cb)))
      } catch {
        user.create(address, "securepass")
        await new Promise((resolve, reject) => user.auth(address, "securepass", (cb: { err: string }) => cb.err ? reject(cb.err) : resolve(cb)))
      }
    }
    // @ts-ignore
    const userData = await new Promise(resolve => user.once(resolve));
    console.log({ userData })
    // @ts-ignore
    const sig = await get(provider).signMessage(`GrandExchange Login ${userData.alias} ${userData.pub}`)

    // @TODO: Add entry by user with signed message and verify 
  }
})


