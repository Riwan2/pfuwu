import React, {useState, useEffect, useRef } from 'react';
import { Chat } from './chat'

var messageID = 0;
function createMessage(content) 
{
    messageID++;
    return {
        id: `id:${messageID}`,
        content: content
    };
};

/*
    Message list
*/

function ChatMessageList({className})
{
    const [messages, setMessages] = useState([]);
    const divRef = useRef(null);
    const followMsgRef = useRef(true);
    const lastHeight = useRef(0);

    useEffect(() => {
        const div = divRef.current;
        div.addEventListener('scroll', onScroll);
        return () => {
            div.removeEventListener('scroll', onScroll);
        }
    }, [divRef]);

    const checkFollowMessage = () => {
        const div = divRef.current;
        const offsetScroll = div.scrollHeight - div.offsetHeight;
        const messageHeight = div.lastChild.previousSibling.offsetHeight;
        if (offsetScroll - div.scrollTop <= messageHeight / 2) followMsgRef.current = true;
        else followMsgRef.current = false;
    }

    const onScroll = (e) => {
        checkFollowMessage();
    }

    const scrollDown = () => {
        if (followMsgRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        } else {
            
            // when resize, the middle messages are always focused
            if (lastHeight.current && lastHeight.current !== divRef.current.scrollHeight) {
                const ratio =  divRef.current.scrollHeight / lastHeight.current;
                const height = divRef.current.offsetHeight;
                const offset = (ratio - 1) * (height / 2);
                divRef.current.scrollTop += offset;
            }
            
            lastHeight.current = divRef.current.scrollHeight;
        }
    };

    Chat.scrollDown = scrollDown;

    const addMessage = (msg) => {
        setMessages([...messages, msg]);
        scrollDown();
    };

    Chat.msgSystem = (content) => {
        const msg = {
            ...createMessage(content),
            type: 'system'
        };
        msg.div = <MessageSystem key={msg.id} msg={msg} />;
        addMessage(msg);
    };

    Chat.msgUser = (user, content) => {
        const msg = {
            ...createMessage(content),
            type: 'system',
            user: user
        };
        msg.div =  <MessageUsr key={msg.id} msg={msg} />;
        addMessage(msg);
    }

    const messageList = messages.map((msg) => {
        return msg.div;
    });
    
    return (
        <div ref={divRef} className={className}> {messageList} </div>
    );
}

/*
    Message pure components
*/

function MessageUsr({msg})
{
    return (
        <div className="msg-user">
            <div className="name"> {"<" + msg.user + ">"} </div>
            <div> {msg.content} </div>
        </div>
    );
}

function MessageSystem({msg})
{
    return (
        <div className="msg-system">
            <span> ▻ </span>
            {msg.content}
        </div>
    );
}


export { ChatMessageList };
