import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hanldePostDataRegister } from '../services/api';

function Register() {
    const [ user, setUser ] = useState<string>("");
    const [ pw, setPw ] = useState<string>("");

    const navigate = useNavigate();

    const handldeRegister = () => {
        const result = hanldePostDataRegister({ userName: user, pass: pw });
        result.then((data: any) => {
            if (data.success) {
                const isConfirmed = confirm(
                    `
                    Register success your ${user}!!\n
                    You want to keep going register\n
                    If no move to the home page`);
                if (!isConfirmed) {
                    alert("ログイン画面へ戻ります");
                    navigate("/login");
                }
                                
            } else {
                alert(data.mess);
            }
        })
            // navigate(-1);
    }

    const handleReturnLogin = () => {

        navigate('/login');
    }
    return <>
        <div id="">

            <h2>新規ユーザー登録画面</h2>
            <p>ユーザーID<input type="text" className={"input-block"} placeholder="abc123" maxLength={10} onChange={(e) => setUser(e.target.value)}/></p>
            <p>パスワード<input type="password" className={"input-block"} placeholder="abc123" maxLength={10} onChange={(e) => setPw(e.target.value)}/></p>
            <button onClick={handldeRegister}>登録</button>
            <button onClick={handleReturnLogin}>戻る</button>
        </div>
    </>

}

export default Register