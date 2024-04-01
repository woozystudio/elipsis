# .woozystudio

The dotwoozystudio software is owned by WoozyStudio projects. This software works as a folder to store mainly markdown, typescript, javascript and json files. Also assets such as images, logos, icons, etc. It is an easy way to interact with those files, and store them there most of the time.

To get started with .woozystudio, the first thing to do is to go to your project console and type the following command:

```bash
npx create-woozystudio-app
```

After that, a folder will be created with the name .woozystudio, and inside that folder there will be 1 markdown file with some instructions apart from this document. Here is an example of how you can include and use this folder in your project:

```ts
import { token } from '../.woozystudio/bot.config.json';

client.login(token).catch((err) => console.error(err));
```

This example is from a discord bot that already includes this folder.