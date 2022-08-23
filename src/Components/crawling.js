import React, { useEffect, useState } from "react";
import './crawling.css';
import axios from "axios";

function Crawling() {
    const [CE, setCE] = useState([]);
    const [SE, setSE] = useState([]);
    const [AI, setAI] = useState([]);

    useEffect(() => {
        axios.get("/crawler")
            .then((res) => {
                console.log(res.data)
                setCE(res.data.ce);
                setSE(res.data.cs);
                setAI(res.data.ai);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div className="crawlingBox">
            <div className="crawlingBoxMsg">&#xE001;_ 학과 공지사항</div>
            <div className="crawlingBox_tab">
                <input type="radio" name="tabmenu" id="tab_all" checked />
                <label for="tab_all">전체</label>
                <input type="radio" name="tabmenu" id="tab_AI" />
                <label for="tab_AI">AI</label>
                <input type="radio" name="tabmenu" id="tab_CE" />
                <label for="tab_CE">CE</label>
                <input type="radio" name="tabmenu" id="tab_SE" />
                <label for="tab_SE">SE</label>

                <div className="conbox all">
                    <table className="crawling">
                        <thead className = "board_head">
                            <tr>
                                <th>구분</th>
                                <th>제목</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            CE.map((i) => {
                                let goView = (link) => {
                                    window.open(link, '_blank').focus();
                                }
                                return (
                                    <>
                                        <tr onClick={() => {goView(i.link)}}>
                                            <td>CE</td>
                                            <td>{i.title}</td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="conbox AI">
                    <table className="crawling">
                        <thead className = "board_head">
                            <tr>
                                <th>구분</th>
                                <th>제목</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            AI.map((i) => {
                                let goView = (link) => {
                                    window.open(link, '_blank').focus();
                                }
                                return (
                                    <>
                                        <tr onClick={() => {goView(i.link)}}>
                                            <td>AI</td>
                                            <td>{i.title}</td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="conbox CE">
                    <table className="crawling">
                        <thead className = "board_head">
                        <tr>
                            <th>구분</th>
                            <th>제목</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            CE.map((i) => {
                                let goView = (link) => {
                                    window.open(link, '_blank').focus();
                                }
                                return (
                                    <>
                                        <tr onClick={() => {goView(i.link)}}>
                                            <td>CE</td>
                                            <td>{i.title}</td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="conbox SE">
                    <table className="crawling">
                        <thead className = "board_head">
                        <tr>
                            <th>구분</th>
                            <th>제목</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            SE.map((i) => {
                                let goView = (link) => {
                                    window.open(link, '_blank').focus();
                                }
                                return (
                                    <>
                                        <tr onClick={() => {goView(i.link)}}>
                                            <td>SE</td>
                                            <td>{i.title}</td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Crawling;