import React from 'react';
import {Message, botReceiveMessage} from './index';
import {db} from '../fire'

//export default () => <Chat room={db.collection('test-chat')}/>
//props: room

export default class Chat extends React.Component {
    constructor(){
        super();
        this.state = {
            messages: [],
            showChat: false,
            newMessage: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBot = this.handleBot.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.props.room.orderBy('time').onSnapshot((snapshot) => {
            this.setState({messages: snapshot.docs});
        });
        this.el && this.scrollToBottom();
    }

    componentDidUpdate() {
        this.el && this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behaviour: 'smooth' });
    }

    handleClick(evt) {
        evt.preventDefault();
        this.setState({showChat: !this.state.showChat});
    }

    handleBot(evt){
        evt.preventDefault();
        this.handleSubmit(evt);
        botReceiveMessage(this.state.newMessage, this.props.room);
    }

    handleChange(evt) {
        this.setState({newMessage: evt.target.value});
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({ newMessage: '' });
        this.props.room.add({
             time: new Date(),
             text: this.state.newMessage,
             from: this.props.user.displayName
         });
    }

    render() {
        return (
            this.state.showChat
                ? (
                    <form className="chatForm" onSubmit={this.handleSubmit}>
                        <div className="chatMessage" >
                            {this.state.messages.map((message, index) => {
                                return <Message key={index} data={message.data()} {...message.data()} />;
                            })}
                            <div ref={el => { this.el = el; }}>
                                <input type="text" value={this.state.newMessage} onChange={this.handleChange} />
                                <input type="submit" />
                                <button className='bot' onClick={this.handleBot} >Bot</button>
                                <button className='toggleChat fa fa-commenting-o' onClick={this.handleClick} />
                            </div>
                        </div>
                    </form>
                    )
                : (
                    <button className="toggleChat fa fa-commenting-o" onClick={this.handleClick} />
                    )
        );
    }
}
