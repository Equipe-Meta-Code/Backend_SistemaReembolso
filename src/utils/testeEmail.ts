// src/utils/testeEmail.ts 
// teste!
// npx ts-node src/utils/testeEmail.ts
import dotenv from "dotenv";
dotenv.config();

import { sendVerificationCode } from "./sendEmail";

(async () => {
  await sendVerificationCode("seuemail@gmail.com", "123456");
})();