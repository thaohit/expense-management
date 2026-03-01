
import express from 'express';
import cors from 'cors';

import { loginRouter } from './routes/loginRouter';
import { registerRouter } from './routes/registerRouter';

const app = express();

// ヘッダー情報を付与
// app.use(cors(
//     ({origin: 'http://localhost:5173'})
// ));
app.use(cors());

// res.bodyがunderfineになるのを防ぐ
app.use(express.json());

// -----------------routes
// login /check-loginが来たら、loginRouterへ遷移
app.use("/check-login", loginRouter);

// 新規登録
app.use("/register", registerRouter);

app.listen(3000, () => {
    console.log("Server running!!");
})
