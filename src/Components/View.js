import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import './View.css';


function ViewPage(){
    const location = useLocation();
    const navigate = useNavigate();
    //const data = location.state.data;
    const [list, setList] = useState([]);
    const [next, setNext] = useState([]);
    const [prev, setPrev] = useState([]);
    const [date, setDate] = useState();
    const [file, setFile] = useState([]);
    let id = useParams().viewId;
    const [test, setTest] = useState(false);

    function timer(d){
        let timestamp = d;
        let date = new Date(timestamp);

        let year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        let day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        let hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        let minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        let second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)

        let returnDate = year + "." + month + "." + day + ". " + hour + ":" + minute + ":" + second;

        return returnDate;
    }

    const updateLoginCheck = () => {
        if(list.author !== window.sessionStorage.getItem("id")){
            alert("사용이 불가합니다.");
        }else{
            navigate('/post_update/' + id, {state: list});
        }
    }
    const deletePost = () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            console.log("여기",id);
            axios.delete('/article/' + id)
                .then((res) => {
                    console.log(res.data);
                    alert("삭제되었습니다.");
                    navigate('/');
                })
                .catch((e) => {
                    console.log(e);
                })
        }else{
            console.log("취소");
        }
    }
    const getPost = async () => {
        //const posts = await axios.get("http://kittaxipool.iptime.org:3000/article/view/" + id)
        const posts = await axios.get("/article/view/" + id)
        console.log(posts);
        setList(posts.data.articleInfo);
        setNext(posts.data.next[0]);
        setPrev(posts.data.prev[0]);
        setDate(timer(posts.data.articleInfo.date));
        console.log(posts.data.files[0]);
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
        <div className="view_section">
            <div className="post_section">
                <div className="post_tag">#{list.tag}</div>
                <h1 className="title">&#xE001;_ {list.title}</h1>
                <div>
                    <div className="post_info_table">
                        <div className="post_info_author"><span class="material-symbols-outlined">&#xe7fd;</span>{list.authorName}</div>
                        <div className="post_info_hit"><span class="material-symbols-outlined">&#xe8f4;</span>{list.views}</div>
                        <div className="post_info_date"><span class="material-symbols-outlined">&#xebcc;</span>{date}</div>
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
                                <a href={"http://localhost:3001/article/download/"+id}>{fileName}</a>
                            )
                        })
                    }
                    <div className="line"></div>
                    <div className="post_content" style={{height: '400px'}} dangerouslySetInnerHTML={{__html : list.content}}></div>
                </div>
                <div>
                    <div className="edit_delete_table">
                        {
                            list.author === window.sessionStorage.getItem("id")
                                ? <>
                                <div className="post_edit" onClick={updateLoginCheck}><span className="material-symbols-outlined">&#xe3c9;</span> 수정</div>
                                <div className="post_delete" onClick={deletePost}><span className="material-symbols-outlined">&#xe92b;</span> 삭제</div>
                                </>
                                : null
                        }

                    </div>
                    <div className="line"></div>
                </div>
                <div className="test">댓글 메뉴 위치 (예정)</div>
                <div className="line"></div>
                <br/>
                <div className="post_list"><span class="material-symbols-outlined">&#xe241;</span> 목록</div>
                <table className="post_table">
                    <tr>
                        <td><span class="material-symbols-outlined">&#xe316;</span> 다음글</td>
                        {
                            next === undefined
                                ? <td>다음 글이 없습니다.</td>
                                : <td onClick={() => {navigate('/view/'+next._id); window.location.reload(); }}>{next.title}</td>
                        }
                    </tr>
                    <tr>
                        <td><span class="material-symbols-outlined">&#xe313;</span> 이전글</td>
                        {
                            prev === undefined
                                ? <td>이전 글이 없습니다.</td>
                                : <td onClick={() => {navigate('/view/'+prev._id); window.location.reload(); }}>{prev.title}</td>
                        }
                    </tr>
                </table>
                {/* <BoardList/> */}
            </div>
        </div>
    )
}
export default ViewPage;