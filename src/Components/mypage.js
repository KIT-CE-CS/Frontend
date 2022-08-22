import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './mypage.css';
import { getCookie, removeCookie } from '../cookie';

function MyInfoPage(){
    const [user, setUser] = useState([]); //user 정보
    const [reportList, setReportList] = useState([]);
    const [myArticle, setMyArticle] = useState([]); //게시물
    const [currentPassword, setCurrentPassword] = useState(""); //기존 비밀번호
    const [newPassword, setNewPassword] = useState(""); //새로운 비밀번호
    const [deleteAccountPassword, setDeleteAccountPassword] = useState(""); //탈퇴 비밀번호 확인

    const [confirmPassword, setConfirmPassword] = useState(""); //새로운 비밀번호 확인
    const [pwCheckMsg, setpwCheckMsg] = useState(""); // 비밀번호 확인 메시지
    const [pwMsgBool, setpwMsgBool] = useState(false); //같은지 유무 메시지
    const navigate = useNavigate();
    //let num = myArticle.length; //article 길이

    function timer(d){
        let timestamp = d;
        let date = new Date(timestamp);

        let year = date.getFullYear().toString(); //년도 뒤에 두자리
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        let day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)

        let returnDate = year + "." + month + "." + day;

        return returnDate;
    }
    
    useEffect(() => {
        checkLogin();
    }, [])

    const checkLogin = () => {
        if (!getCookie('kit_acs')) {
            alert("로그인이 필요합니다.")
            navigate("/login");
        }
    }

    //비밀번호 변경관련 핸들러
    const onCurrentPasswordHandler = (event) => {
        setCurrentPassword(event.currentTarget.value);
        checkPassword(event.currentTarget.value);
    }
    const onNewPasswordHandler = (event) => {
        setNewPassword(event.currentTarget.value);
        checkPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
        checkPassword(event.currentTarget.value);
    }
    const onDeleteAccountPassword = (event) => {
        setDeleteAccountPassword(event.currentTarget.value);
    }
    function checkPassword(target) {
        if (newPassword !== target)
        {
            setpwMsgBool(false);
            setpwCheckMsg("비밀번호가 서로 일치하지 않습니다.");
        }
        else if (newPassword === target)
        {
            setpwMsgBool(true);
            setpwCheckMsg("비밀번호가 일치합니다.");
        }
    }

    //비밀번호 변경 axios
    const onPasswordChange = (event) => {
        event.preventDefault();
        if(newPassword !== confirmPassword){ //비밀번호 입력이 같은지 확인
            return alert("비밀번호가 서로 일치하지 않습니다.");
        }else{
            //비밀번호 변경 axios
            let data = {
                newPassword: `${newPassword}`,
                password: `${currentPassword}`
            };
            const headers = {
                "Content-Type": `application/json`,
            };
            axios.patch('/mypage/password', data, headers)
                .then((res) => {
                    console.log(res);
                    alert("변경되었습니다.");
                    window.location.reload();
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    }

    //회원탈퇴 axios
    const onDeleteAccount = async () => {
        if(window.confirm("정말로 탈퇴하시겠습니까??")){
            await axios.delete('/sign/', {
                data: {
                    password: `${deleteAccountPassword}`
                }
            })
                .then((res) => {
                    console.log(res);
                    alert("탈퇴되었습니다ㅠㅠ");
                    removeCookie("kit_acs", { domain: "localhost", path: "/" });
                    navigate('/');
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response.data.message == "Wrong Password")
                        alert("비밀번호가 맞지 않습니다.")
                })
        }else{
            console.log("취소");
        }
    }

    //신고 리스트 가져오는 axios
    const getReportList = async () => {
        const res = await axios.get('/report')
            .then((res) => {
                console.log(res.data);
                setReportList(res.data);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    useEffect(() => {
        if(!getCookie('kit_acs')){
            alert("로그인 후 이용가능!!");
            navigate("/");
        }
        //mypage 정보 가져오는 axios
        axios.get('/mypage/')
            .then((res) => {
                console.log(res.data);
                setUser(res.data);
                setMyArticle(res.data.article)
            })
            .catch((e) => {
                console.log(e);
            })
        getReportList();
    }, [])

    return (
        <div className='view_section'>
            <div className='left_mypage'>
                <div className="mypage_box">
                    <h1 className="mypage_title">&#xE001;_ MyPage</h1>
                    <form>
                        <div className="mypage_msg">이름</div>
                        <div className="mypage_row">
                            <div className="name_show">{user.name}</div>
                        </div>
                        <div className="mypage_msg">금오공대 웹메일</div>
                        <div className="mypage_row">
                            <div className="webmail_show">{user.email}@kumoh.ac.kr</div>
                        </div>
                        <div className="mypage_msg">아이디</div>
                        <div className="mypage_row">
                            <div className="id_show">{user.id}</div>
                        </div>
                        <div className="mypage_msg">비밀번호 수정</div>
                        <div className="mypage_row">
                            <input type="password" name="password" value={currentPassword} placeholder="Current Password" className="reg_pw_input" onChange={onCurrentPasswordHandler} /><br/>
                        </div>
                        <div className="mypage_row">
                            <input type="password" name="password" value={newPassword} placeholder="New Password" className="reg_pw_input" onChange={onNewPasswordHandler} /><br/>
                        </div>
                        <div className="mypage_row">
                            <input type="password" name="confirmPassword" value={confirmPassword} placeholder="New Password Confirm" className="confirm_pw_input" onChange={onConfirmPasswordHandler} /><br/>
                        </div>
                        <div className={pwMsgBool ? 'success' : 'failure'}>{pwCheckMsg}</div>
                        <div className="button_container">
                            <button type="submit" className="pw_edit_button" onClick={onPasswordChange} >비밀번호 변경</button>
                        </div>
                    </form>
                </div>
                <div className='admin_box'>
                    <h1>&#xE001;_ UserGrade</h1>
                </div>
            </div>
            <div className="margin_section"></div>
            <div className='right_mypage'>
                <div className="mypost_box">
                    {/* {
                        myArticle.slice(0).reverse().map((i) => {
                            let goView = (e) => {
                                navigate('view/'+i._id, {state : i});
                            }
                            return (
                                <tr onClick={goView}>
                                    <td>1{num--}</td>
                                    <td>title{i.title}</td>
                                    <td>date{timer(i.date)}</td>
                                    <td>2{i.commentList.length}</td>
                                </tr>
                            )
                        })
                    } */}
                    <h1>&#xE001;_ MyPost</h1>
                    <table>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성일</th>
                            <th>댓글수</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>title</td>
                            <td>date</td>
                            <td>2z</td>
                        </tr>
                    </table>
                </div>
                <div className='report_box'>
                    <h1>&#xE001;_ ReportList</h1>
                    <table>
                        <tr>
                            <th>번호</th>
                            <th>카테고리</th>
                            <th>ID</th>
                            <th>신고사유</th>
                            <th>신고자</th>
                            <th>신고일</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>댓글</td>
                            <td>asdf213</td>
                            <td>qwer</td>
                            <td>qwerty</td>
                            <td>2022.08.10 17:00</td>
                            <td>삭제</td>
                        </tr>
                    </table>
                </div>
                <br/><br/><br/>
                <input type="password" className="delete_account_password" onChange={onDeleteAccountPassword} placeholder="비밀번호를 입력해주세요"/>
                <button type="button" className="delete_account" onClick={onDeleteAccount}>회원탈퇴</button>
            </div>
        </div>
    )
}
export default MyInfoPage;