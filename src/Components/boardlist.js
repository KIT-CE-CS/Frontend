import React from "react";
import './boardlist.css';
import BoardRow from './boardrow';
import Crawling from './crawling.js';

function BoardList() {
    return(
        <div className = "viewArea">
            <div className = "bodyArea">
                <div className="mainSection">
                    <div className="box">
                        <div className="boxTitle">&#xE001;_ 전체 게시판</div>
                        <table className = "board_list_table">
                            <thead className = "board_head">
                            <tr>
                                <th>번호</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                            </thead>
                        </table>
                        <div className="board_list_body">
                            <BoardRow />
                        </div>
                    </div>
                </div>
                <div className="sideSection">
                    <Crawling />
                </div>
            </div>
        </div>
    )
}

export default BoardList;