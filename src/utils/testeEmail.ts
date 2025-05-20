// src/utils/testeEmail.ts
import dotenv from "dotenv";
dotenv.config();

import { sendVerificationCode } from "./sendEmail";

(async () => {
  await sendVerificationCode("mluizaguedessilva@gmail.com", "123456");
})();