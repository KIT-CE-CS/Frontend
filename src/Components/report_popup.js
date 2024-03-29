import React from 'react';
import './report_popup.css';

const Report = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header, submit} = props;

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>
                        {props.children}
                    </main>
                    <footer>
                        <button className="close" onClick={submit}>
                            제출하기
                        </button>
                        <button className="close" onClick={close}>
                            취소
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default Report;