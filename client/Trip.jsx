import React, {Component} from 'react';
import { db } from '../fire'
import {Chat, Pinned, Itinerary} from './index'
import { Sidebar } from './Sidebar';


export default class Trip extends Component {

    constructor(props){
        super(props)
        this.state = {
            tripId: props.match.params.tripId, //ADDED
            isPartOfTrip: true,
            startDate: {},
            endDate: {},
            name: '',
            showInvite: false,
            numOfUsers: 0
        }
        this.sendInvite = this.sendInvite.bind(this);
    }


    // if we set the tripId on state as well and then render using that, we should be good.
    // MIGHT STILL NEED A COMPONENTWILLRECEIVEPROPS / COMPONENTSHOULDUPDATE THO
    // fetch (tripRef){
    //     tripRef.get().then(doc => {
    //         if (doc.exists && doc.data().users[this.props.user.uid]) {
    //             const { startDate, endDate, name, users } = doc.data();
    //             // console.log("USERSSSSS", users)
    //             this.setState({ isPartOfTrip: true, startDate, endDate, name, numOfUsers: getTrue(users) });
    //             console.log('got some new data incl dates: ', startDate, endDate)
    //         } else {
    //             console.log("No such document!");
    //         }
    //     }).catch(error => {
    //         console.log("Error getting document: ", error);
    //     })
    // }

    componentDidMount(){
        this.setState({ tripId: this.props.match.params.tripId}) //ADDED
        this.unsubscribe = db.collection('trips').doc(this.props.match.params.tripId)
            .onSnapshot((doc) => {
                this.setState({...doc.data(), numOfUsers: getTrue(doc.data().users), isPartOfTrip: true})
                console.log('inside of snapshot thing in trip now......', doc.data())
            });

        // this.fetch(db.collection('trips').doc(this.props.match.params.tripId))
    }

    componentWillReceiveProps(nextProps){
        this.setState({ tripId: nextProps.match.params.tripId }) //ADDED
        if(this.props !== nextProps) this.props = nextProps;
        this.unsubscribe && this.unsubscribe();
        this.unsubscribe = db.collection('trips').doc(nextProps.match.params.tripId)
            .onSnapshot((doc) => {
                this.setState({ ...doc.data(), numOfUsers: getTrue(doc.data().users), isPartOfTrip: true })
                console.log('inside of snapshot thing in trip now......', doc.data())
            });
        // this.fetch(db.collection('trips').doc(nextProps.match.params.tripId))
    }


    /* NOTES: it would be cool if it rendered "sent mail" for a second */
    sendInvite(evt){
        evt.preventDefault();
        //target email is evt.target.toEmail.value
        console.log('inside of sendInvite')
        const [email, tripId, tripName, displayName] = [evt.target.toEmail.value, this.props.match.params.tripId, this.state.name, this.props.user.displayName]
        console.log('email and tripId', email, tripId, tripName, displayName);
        db.collection('invites')
            .add({
                email,
                displayName,
                tripId,
                tripName
            })

        /* reset the input field blank and hide invite form */
        evt.target.toEmail.value = '';
        this.setState({showInvite: false});
    }

    render(){
        const tripRef = db.collection('trips').doc(this.state.tripId); //UPDATED
        let isPartOfTrip = this.state.isPartOfTrip;
        return (
            (isPartOfTrip ?
            <div className="trip-whole-page">
                <div className="trip-header">
                    <h1>{this.state.name}</h1>
                        <button className="btn waves-effect waves-light" id="invite-btn" onClick={() => this.setState({showInvite: !this.state.showInvite})}>Invite!</button>
                    {this.state.showInvite &&
                        <form className="center-form" onSubmit={this.sendInvite}>
                            <label className="label">
                                <input type="text" name="toEmail" id="email-input" />
                            </label>
                            <input className="btn center-self" type="submit" value="Submit" />
                        </form>
                    }
                </div>
                <div className="chat-itin-pin container-fluid">
                    <Chat room={tripRef.collection('chat')} user={this.props.user} />
                <div className="flex-row-wrap around chat-itin-pin container-fluid">
                    <Chat room={tripRef.collection('chat')} user={this.props.user} numOfUsers={this.state.numOfUsers} events={tripRef.collection('event')} />
                    <Itinerary
                        trip= {tripRef}
                        room={tripRef.collection('event')}
                        user={this.props.user}
                        startDate={this.state.startDate}
                        endDate = {this.state.endDate} />
                    <Pinned room={tripRef.collection('event')} user={this.props.user} />
                </div>
            </div>
            </div>
            :
            <div>
                You need to be invited to this trip!
            </div>)
        )
    }
}

function getTrue(obj){
    let truthy = 0;
    for (var person in obj) {
        if (obj[person]) truthy++}
    return truthy;
 }
