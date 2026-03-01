import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { handlePostDataLogin } from '../services/api';

/**
 * Login ログイン画面での処理
*/ 
function Login() {
    const navigate = useNavigate();
    
    const hanldeLogin = (): void => {
        // 入力したユーザー・PWをAPIへ送信
        let result: Promise<boolean> = handlePostDataLogin({userName: inputUserName, pass: inputPass})
        result.then((data) => {
            console.log('data: ', data);
            // ホームページへ遷移
            if(data) {
                // alert("Login Success!")
                navigate("/home");
            } else {
                alert("ユーザーIDまたはパスワードが正しくない!")
            }
        })
    }
    const hanldeRegister = ():void => {
        navigate('/register')
    }
    // ユーザー・PW宣言
    const [inputUserName, setInputUserName] = useState<string>("");
    const [inputPass, setInputPass] = useState<string>("");

    return (
        <div>
            <h2>ログイン画面</h2>

            <p>ユーザーID<input type="text" className={"input-block"} placeholder="abc123" maxLength={10} onChange={(e) => setInputUserName(e.target.value)}/></p>
            <p>パスワード<input type="password" className={"input-block"} placeholder="abc123" maxLength={10} onChange={(e) => setInputPass(e.target.value)}/></p>
            <button onClick={hanldeLogin}>ログイン</button>
            <button onClick={hanldeRegister}>新規登録</button>

        </div>

    );
}


export default Login;