import React, {useState, useEffect} from 'react';
import { getCookie, removeCookie } from '../cookie';
import {Button, Dialog, DialogContent, IconButton, TextField} from "@mui/material";
import axios from 'axios';
import './comments.scss';


const Recomments = (props) => {
    const [reCommentsList, setReCommentsList] = useState([]);
    const [comment, setComment] = useState([]);
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

        let returnDate = year + "/" + month + "/" + day + "/ " + hour + ":" + minute + ":" + second;
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
        // if(!`${content}`){
        //     data = {content: `${reCommentContent}`}
        // }else{
        //     data = {content: `${content}`}
        // }
        const res = await axios.post('/comment/' + props.comment._id, data, headers)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch((e) => {
                if (e.response.data.message === "Unauthorized") {
                    alert("로그인 후 이용 가능합니다.");
                }
            })
    }

    //댓글 삭제 axios
    const deleteComment = async (e) => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            const res = await axios.delete('/comment/' + e.currentTarget.value)
                .then((res) => {
                    alert("댓글이 삭제되었습니다.");
                    window.location.reload();
                    console.log(res);
                })
                .catch((e) => {
                    console.log(e);
                })
        }else{
            console.log("취소");
        }
    }

    //댓글 수정 axios
    const updateComment = async (e) => {
        console.log(e.currentTarget.value);
        const res = await axios.patch('/comment/' + e.currentTarget.value, data, headers)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch((e) => {
                console.log(e);
            })
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
                            {
                                comment.isMine
                                    ? <>
                                        <button type="button" className="comment_update" value={comment.content} onClick={onCheckUpdate}>수정</button>
                                        <button type="button" className="comment_delete" value={comment._id} onClick={deleteComment}>삭제</button>
                                    </>
                                    : null
                            }
                            {
                                comment.isRecomment === false
                                    ? <button type="button" className="recomment_button" onClick={onCheckRecomment}>댓글달기</button>
                                    : null
                            }
                        </>
                }
                {
                    comment.isDeleted === false
                        ? <div className="post_report" ><span className="material-symbols-outlined">&#xe160;</span> 신고</div>
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
                                <div className="comment_username_date">
                                    <div className="comment_date">{timer(item.date)}</div>
                                </div>
                                <div className="comment_content">{item.content}</div>
                                <div className="comment_username">{item.authorName}
                                    ({
                                        item.author? 
                                            item.author
                                            :
                                            "알 수 없음"
                                    })
                                </div>
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

