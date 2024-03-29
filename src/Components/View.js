import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import './View.css';
import Crawling from './crawling.js';
import Comments from './comments';
import Report from './report_popup';
import dompurify from "dompurify";


function ViewPage(){
    const navigate = useNavigate();
    const sanitizer = dompurify.sanitize;
    const [list, setList] = useState([]);
    const [next, setNext] = useState([]);
    const [prev, setPrev] = useState([]);
    const [date, setDate] = useState();
    const [file, setFile] = useState([]);
    let id = useParams().viewId;
    const [test, setTest] = useState(false); //<hr> 태그 테스트용 (수정필요시 변경)

    const [reportOpen, setReportOpen] = useState(false); //신고 팝업창
    const [reportReason, setReportReason] = useState(""); //신고사유
    const [reportType, setReportType] = useState("");
    const [reportSubmitCheck, setReportSubmitCheck] = useState(true); //신고하기 버튼 체크용
    const reasonText = [
        {reason: "음란물/불건전한 만남 및 대화"},
        {reason: "상업적 광고 및 판매"},
        {reason: "욕설/비하"},
        {reason: "낚시/놀람/도배"},
        {reason: "게시판 성격에 부적절함"},
        {reason: "정당/정치인 비하 및 선거운동"},
        {reason: "유출/사칭/사기"}
    ]

    const openReport = () => {
        setReportOpen(true);
    }
    const closeReport = () => {
        setReportOpen(false);
    }
    const reportData = (e) => {
        setReportReason(e.currentTarget.value);
        setReportType(e.currentTarget.name);
    }

    let data = {
        id: `${list._id}`,
        targetType: `${reportType}`,
        reason: `${reportReason}`
    }
    const headers = {
        "Content-Type": `application/json`,
    };
    //신고사유 보내는 axios
    const reportSubmit = async (e) => {
        if(reportSubmitCheck){
            setReportSubmitCheck(false);
            if(window.confirm(reportReason + " 사유가 맞나요?")){
                await axios.post('/report', data, headers)
                    .then((res) => {
                        alert("신고되었습니다!");
                        window.location.reload();
                    })
                    .catch((e) => {
                        alert("로그인을 다시 확인해주세요.");
                        console.log(e);
                    })
            }else{
                console.log("취소");
                setReportSubmitCheck(true);
            }
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }

    function timer(d){
        let timestamp = d;
        let date = new Date(timestamp);

        let year = date.getFullYear().toString().slice(0); //년도 뒤에 두자리
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        let day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        let hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        let minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        let second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
        
        let returnDate = year + "." + month + "." + day + ". " + hour + ":" + minute + ":" + second;
        return returnDate;
    }

    //게시물 수정페이지 이동(로그인 유무 확인 후)
    const updateLoginCheck = () => {
        if(!list.isMine){
            alert("사용이 불가합니다.");
        }else{
            navigate('/post_update/' + id, {state: {list : list, file : file}});
        }
    }

    //게시물 삭제 axios
    const deletePost = () => {
        if(reportSubmitCheck){
            setReportSubmitCheck(false);
            if(window.confirm("정말 삭제하시겠습니까?")){
                axios.delete('/article/' + id)
                    .then((res) => {
                        alert("삭제되었습니다.");
                        navigate('/');
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            }else{
                console.log("취소");
                setReportSubmitCheck(true);
            }
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }
    const getPost = async () => {
        const posts = await axios.get("/article/view/" + id)
        console.log(posts);
        setList(posts.data.articleInfo);
        setNext(posts.data.next[0]);
        setPrev(posts.data.prev[0]);
        setDate(timer(posts.data.articleInfo.date));
        setFile(posts.data.files);
        if(posts.data.files[0] !== undefined){
            setTest(true);
        }else{
            setTest(false);
        }
    }

    useEffect(() => {
        getPost();
    }, [])

    return (
        <div className = "viewArea">
            <div className = "bodyArea">
                <div className = "mainSection">
                    <div className='box'>
                        <div className="post_tag" onClick={() => navigate("/"+list.tag)}>#{list.tag}</div>
                        <h1 className="boxBigTitle">&#xE001;_ {list.title}</h1>
                        <div className="post_info_table">
                            {
                                list.authorName === ""
                                    ? <div className="post_info_author"><span
                                        className="material-symbols-outlined">&#xe7fd;</span> (알 수 없음)
                                    </div>
                                    : <div className="post_info_author"><span
                                        className="material-symbols-outlined">&#xe7fd;</span> {list.authorName}({list.author})
                                    </div>
                            }
                            <div className="post_info_hit"><span class="material-symbols-outlined">&#xe8f4;</span> {list.views}</div>
                            <div className="post_info_date"><span class="material-symbols-outlined">&#xebcc;</span> {date}</div>
                        </div>
                        {
                            test === true
                                ? <div className="line"></div>
                                : null
                        }
                        {
                            file.map((i) => {
                                let id = i._id;
                                let fileName = i.originName;
                                return (
                                    <div>
                                        <a href={"http://kitacs.com:3001/article/download/"+id}>&#xE226;{fileName}</a>
                                    </div>
                                )
                            })
                        }
                        <div className="line"></div>
                        <div className="post_content" dangerouslySetInnerHTML={{__html : sanitizer(list.content)}}></div>
                        <div className="edit_delete_report_container">
                        {
                            list.isMine
                                ? <>
                                    <div className="ebutton post_edit" onClick={updateLoginCheck}><span className="material-symbols-outlined">&#xe3c9;</span> 수정</div>
                                    <div className="ebutton post_delete" onClick={deletePost}><span className="material-symbols-outlined">&#xe92b;</span> 삭제</div>
                                    <div className="ebutton post_report" onClick={openReport}><span className="material-symbols-outlined">&#xe645;</span> 신고</div>
                                    <Report open={reportOpen} close={closeReport} submit={reportSubmit} header="신고하기">
                                        {
                                            reasonText.map((item) => {
                                                return(
                                                    <button type="button" className="Reason" name="article" value={item.reason} onClick={reportData}>{item.reason}</button>
                                                )
                                            })
                                        }
                                    </Report>
                                </>
                                : <>
                                    <Report open={reportOpen} close={closeReport} submit={reportSubmit} header="신고하기">
                                        {
                                            reasonText.map((item) => {
                                                return(
                                                    <button type="button" className="Reason" name="article" value={item.reason} onClick={reportData}>{item.reason}</button>
                                                )
                                            })
                                        }
                                    </Report>
                                    <div className="ebutton post_report" onClick={openReport}><span className="material-symbols-outlined">&#xe645;</span> 신고</div>
                                </>
                        }
                        </div>
                    </div>
                    <div className="box post_comments_box">
                        <Comments post_id={id} />
                    </div>
                    <div className='box'>
                        <div className="post_list" onClick={() => navigate("/" + list.tag)}><span class="material-icons-outlined">&#xe241;</span> 목록</div>
                        <table className="post_table">
                            <tr>
                                <td><span class="material-icons-outlined">&#xe316;</span> 다음글</td>
                                {
                                    next === undefined
                                        ? <td>다음 글이 없습니다.</td>
                                        : <td onClick={() => {navigate('/view/'+next._id); window.location.reload(); }}>{next.title}</td>
                                }
                            </tr>
                            <tr>
                                <td><span class="material-icons-outlined">&#xe313;</span> 이전글</td>
                                {
                                    prev === undefined
                                        ? <td>이전 글이 없습니다.</td>
                                        : <td onClick={() => {navigate('/view/'+prev._id); window.location.reload(); }}>{prev.title}</td>
                                }
                            </tr>
                        </table>
                    </div>
                </div>
                <div className='sideSection'>
                    <Crawling></Crawling>
                </div>
            </div>
        </div>
    )
}
export default ViewPage;