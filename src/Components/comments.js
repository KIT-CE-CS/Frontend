import React, {useState, useEffect} from 'react';
import { getCookie, removeCookie } from '../cookie';
import {Button, Dialog, DialogContent, IconButton, TextField} from "@mui/material";
import axios from 'axios';
import './comments.scss';
import Recomments from './recomments';


const Comments = (props) => {
    const [commentsList, setCommentsList] = useState([]); //보여줄 comments 리스트
    const [content, setContent] = useState(""); //댓글 내용

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
        const res = await axios.post('/comment/' + props.post_id, data, headers)
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

    //댓글 리스트 가져오는 axios
    const getCommentList = async () => {
        const list = await axios.get('/comment/' + props.post_id)
            .then((res) => {
                setCommentsList(res.data);
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    useEffect(() => {
        getCommentList();
    }, [])

    return (
        <>
           <div className="comments_wrapper">
               <div className="comments_header">
                   <TextField
                       className="comments_header_textarea"
                       maxRows={3}
                       onClick={isLogin}
                       onChange={(e) => {
                           setContent(e.target.value)
                       }}
                       multiline placeholder="댓글을 입력해주세요✏️"
                   />
                   {
                       content !== ""
                       ? <Button variant="outlined" onClick={commentOnSubmit}>등록하기</Button>
                       : <Button variant="outlined" disabled={true}>등록하기</Button>
                   }
               </div>
           </div>
           <div className="comments_body">
               {
                   commentsList.map((item, index) => (
                       <>
                           <div key={index} className="comments_comment">
                               {
                                   item.isDeleted === true
                                       ? <div className="delete_message">삭제된 댓글입니다.</div>
                                       : <>
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
                                       </>
                               }
                               <div className="recomment_box">
                                   <Recomments comment={item} recomments={item.recommentList}></Recomments>
                               </div>
                           </div>
                           {
                               item.recommentList.length !==0
                               ? <hr className="asdasd"/>
                               : null
                           }
                       </>
                   ))
               }
           </div>
        </>
    )
}

export default Comments;

