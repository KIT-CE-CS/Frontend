import React, {useState, useEffect} from 'react';
import { getCookie} from '../cookie';
import {Button, TextField} from "@mui/material";
import axios from 'axios';
import './comments.scss';
import Report from "./report_popup";

const Recomments = (props) => {
    const [reCommentsList, setReCommentsList] = useState([]);
    const [comment, setComment] = useState([]);
    const [commentCheck, setCommentCheck] = useState(true) //댓글 등록 버튼 체크
    const [content, setContent] = useState(""); //댓글 내용
    const [isReComment, setIsReComment] = useState(false); //댓글달기 버튼 클릭 체크
    const [isUpdateButton, setIsUpdateButton] = useState(false); //수정 버튼 클릭 체크
    const [originComment, setOriginComment] = useState(""); //원래 댓글 내용 (수정하기 버튼 비활성화 용도)

    function timer(d) {
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

    //댓글달기 버튼 체크
    const onCheckRecomment = () => {
        setContent("");
        setIsReComment(!isReComment);
        setIsUpdateButton(false);
    }

    //수정 버튼 체크
    const onCheckUpdate = (e) => {
        setContent(e.currentTarget.value);
        setOriginComment(e.currentTarget.value);
        setIsUpdateButton(!isUpdateButton);
        setIsReComment(false);
    }

    //로그인 유무 확인
    const isLogin = () => {
        if(getCookie('kit_acs')){
            return true;
        }else{
            return false;
        }
    }

    let data = {
        content: `${content}`
    };
    const headers = {
        "Content-Type": `application/json`,
    };
    //댓글 작성 axios
    const commentOnSubmit = async () => {
        if(commentCheck) {
            setCommentCheck(false);
            await axios.post('/comment/' + props.comment._id, data, headers)
                .then((res) => {
                    window.location.reload();
                })
                .catch((e) => {
                    if (e.response.data.message === "Unauthorized") {
                        alert("로그인 후 이용 가능합니다.");
                    }
                })
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }

    //댓글 삭제 axios
    const deleteComment = async (e) => {
        if(commentCheck) {
            setCommentCheck(false);
            if(window.confirm("정말 삭제하시겠습니까?")){
                await axios.delete('/comment/' + e.currentTarget.value)
                    .then((res) => {
                        alert("댓글이 삭제되었습니다.");
                        window.location.reload();
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            }else{
                console.log("취소");
                setCommentCheck(true);
            }
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }

    //댓글 수정 axios
    const updateComment = async (e) => {
        if(commentCheck) {
            setCommentCheck(false);
            await axios.patch('/comment/' + e.currentTarget.value, data, headers)
                .then((res) => {
                    window.location.reload();
                })
                .catch((e) => {
                    console.log(e);
                })
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }

    const [reportOpen, setReportOpen] = useState(false); //신고 팝업창
    const [reportReason, setReportReason] = useState(""); //신고사유
    const [reportType, setReportType] = useState("");
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

    let data2 = {
        id: `${comment._id}`,
        targetType: `${reportType}`,
        reason: `${reportReason}`
    }
    //신고사유 보내는 axios
    const reportSubmit = async (e) => {
        if(commentCheck) {
            setCommentCheck(false);
            if(window.confirm(reportReason + " 사유가 맞나요?")){
                await axios.post('/report', data2, headers)
                    .then((res) => {
                        alert("신고되었습니다!");
                        window.location.reload();
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            }else{
                console.log("취소");
                setCommentCheck(true);
            }
        }else{
            alert("잠시만 기다려주세요!!");
        }
    }

    useEffect(() => {
        setReCommentsList(props.recomments)
        setComment(props.comment)
    }, [])

    return (
        <>
            <div className="recomments_wrapper">
                {
                    comment.isDeleted === true
                        ? null
                        : <>
                            <div className='comment_button_box'>
                            {
                                comment.isMine
                                    ? <>
                                        <button type="button" className="ebutton comment_update" value={comment.content} onClick={onCheckUpdate}>
                                            <span className="material-icons">&#xe3c9;</span> 수정</button>
                                        <button type="button" className="ebutton comment_delete" value={comment._id} onClick={deleteComment}>
                                            <span className="material-icons">&#xe92b;</span> 삭제</button>
                                    </>
                                    : null
                            }
                            {
                                comment.isRecomment === false
                                    ? <button type="button" className="sbutton recomment_button" onClick={onCheckRecomment}>댓글달기</button>
                                    : null
                            }
                            </div>
                        </>
                }
                {
                    comment.isDeleted === false
                        ? <>
                            <button type='button' className="ebutton comment_report" onClick={openReport}><span className="material-icons">&#xe645;</span> 신고</button>
                            <Report open={reportOpen} close={closeReport} submit={reportSubmit} header="신고하기">
                                {
                                    reasonText.map((item) => {
                                        return(
                                            <button type="button" className="Reason" name="comment" value={item.reason} onClick={reportData}>{item.reason}</button>
                                        )
                                    })
                                }
                            </Report>
                        </>
                        : null
                }
                <hr/>
                {
                    isReComment === true
                        ? <div className="comments_header">
                                <TextField
                                    className="comments_header_textarea"
                                    maxRows={3}
                                    onClick={isLogin}
                                    onChange={(e) => {
                                        setContent(e.target.value)
                                    }}
                                    value={content}
                                    multiline placeholder="댓글을 입력해주세요✏️"
                                />
                                {
                                    content !== ""
                                        ? <Button variant="outlined" onClick={commentOnSubmit}>등록하기</Button>
                                        : <Button variant="outlined" disabled={true}>등록하기</Button>
                                }
                            </div>
                        : ( isUpdateButton === true
                                ? <div className="comments_header">
                                    <TextField
                                        className="comments_header_textarea"
                                        maxRows={3}
                                        onClick={isLogin}
                                        onChange={(e) => {
                                            setContent(e.target.value)
                                        }}
                                        value={content}
                                        multiline placeholder="댓글을 입력해주세요✏️"
                                    />
                                    {
                                        content !== originComment
                                            ? <Button variant="outlined" value={comment._id} onClick={updateComment}>수정하기</Button>
                                            : <Button variant="outlined" disabled={true}>수정하기</Button>
                                    }
                                </div>
                                : null
                        )
                }
            </div>
            <div className="recomments_body">
                {
                    reCommentsList.map((item, index) => (
                        <>
                            <div key={index} className="comments_comment">
                                <div className='comment_info_box'>
                                    <div className='comment_user_box'>
                                        {
                                        item.author === ""
                                            ? <div className="comment_username"><span
                                            className="material-symbols-outlined">&#xe7fd;</span> (알 수 없음)</div>
                                            : <div className="comment_username"><span
                                            className="material-symbols-outlined">&#xe7fd;</span> {item.authorName}({item.author})</div>
                                        }
                                    </div>
                                    <div className="comment_date"><span class="material-symbols-outlined">&#xebcc;</span> {timer(item.date)}</div>
                                </div>
                                <div className="comment_content">{item.content}</div>
                            </div>
                            <div className="recomment_box">
                                <Recomments comment={item} recomments={item.recommentList}></Recomments>
                            </div>
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default Recomments;

