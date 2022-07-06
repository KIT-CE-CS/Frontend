import React, {useState} from 'react';
import './mypage.css';

function RegisterPage(){
    const [password, setPassword] = useState(""); //비밀번호
    const [confirmPassword, setConfirmPassword] = useState(""); //비밀번호 확인


    return (
        <div className="mypage_box">
            <h1 className="mypage_title">&#xE001;_ MyPage</h1>
            <form>
                <div className="mypage_msg">이름</div>
                <div className="mypage_row">
                    <div className="name_show">Name</div> {/* {user.name} */}
                </div>
                <div className="mypage_msg">금오공대 웹메일</div>
                <div className="mypage_row">
                    <div className="webmail_show">WebMail@kumoh</div> {/* {user.name} */}
                </div>
                <div className="mypage_msg">아이디</div>
                <div className="mypage_row">
                    <div className="_id_show">ID</div> {/* {user.id} */}
                </div>
                <div className="mypage_msg">비밀번호</div>
                <div className="mypage_row">
                    <input type="password" name="password" value={password} placeholder="Password" className="reg_pw_input" onChange={onPasswordHandler} /><br/>
                </div>
                <div className="mypage_row">
                    <input type="password" name="confirmPassword" value={confirmPassword} placeholder="Password Confirm" className="confirm_pw_input" onChange={onConfirmPasswordHandler} /><br/>
                </div>
                <div className="button_container">
                    <button className="pw_edit_button" onSubmit={onSubmit} >비밀번호 변경</button>
                </div>
            </form>
        </div>
    )
}
export default MyPage;