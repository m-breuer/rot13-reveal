# @m-breuer/rot13-reveal 

Client-side ROT13 obfuscation and interaction-triggered reveal utility.

## Install

npm install @m-breuer/rot13-reveal

## Usage
```ts 
import { mountRot13Reveal } from "@m-breuer/rot13-reveal"; 

mountRot13Reveal(document.getElementById("contact")!, "your@email.com", { 
    label: "Show email", 
    mailtoAfterReveal: true 
});
```