import React, {Component} from 'react';
import { db } from '../fire'
import {Chat, Pinned, Itinerary} from './index'


export default class Trip extends Component {

    constructor(){
        super()
        this.state = {
            isPartOfTrip: false,
            startDate: {},
            endDate: {},
            name: '',
            showInvite: false
        }
        this.sendInvite = this.sendInvite.bind(this);
    }

    componentDidMount(){
        const tripRef = db.collection('trips').doc(this.props.match.params.tripId);

        tripRef.get().then(doc => {
            if (doc.exists && doc.data().users[this.props.user.uid]) {
                const { startDate, endDate, name } = doc.data();
                this.setState( {isPartOfTrip: true, startDate, endDate, name } );
                // console.log('this state is: ', this.state)
                // console.log("Document data:", doc.data().users[this.props.user.uid]);
            } else {
                console.log("No such document!");
            }
        }).catch(error => {
            console.log("Error getting document: ", error);
        })
    }

    /* NOTES: it would be cool if it rendered "sent mail" for a second */
    sendInvite(evt){
        evt.preventDefault();
        //target email is evt.target.toEmail.value
        const [email, tripId] = [evt.target.toEmail.value, this.props.match.params.tripId]
        console.log('invite target email and tripId', email, tripId);
        db.collection('users')
            .doc(this.props.user.uid)
            .set({ invitee: [email, tripId ]}, {merge: true});
        evt.target.toEmail.value = '';
        this.setState({showInvite: false});

    }

    render(){
        const tripRef = db.collection('trips').doc(this.props.match.params.tripId);
        let isPartOfTrip = this.state.isPartOfTrip;

        return (
            isPartOfTrip ?
            <div>
                <div className="trip-header">
                    <h1>{this.state.name}</h1>
                    <button onClick={() => this.setState({showInvite: !this.state.showInvite})}>Invite!</button>
                    {this.state.showInvite &&
                        <form onSubmit={this.sendInvite}>
                            <label>
                                <input type="text" name="toEmail" />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    }
                </div>
                <div className="flex-row-wrap around">
                    <Chat room={tripRef.collection('chat')} user={this.props.user} />
                    <Itinerary
                        room={tripRef.collection('event')}
                        user={this.props.user}
                        startDate={this.state.startDate}
                        endDate = {this.state.endDate} />
                    <Pinned room={tripRef.collection('event')} user={this.props.user} />
                </div>
            </div>
            :
            <div>
                You need to be invited to this trip!
            </div>
        )
    }
}

