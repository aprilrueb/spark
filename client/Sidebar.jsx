import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { db } from '../fire';
import { SideNavItem, SideNav, Button, Icon } from 'react-materialize'
import { withRouter } from 'react-router'
import AddTrip from './AddTrip'
// import { SideNavItem, Nav, NavIcon, NavText } from 'react-sidenav';


//export default class Sidebar extends Component {

export class Sidebar extends Component {

    constructor() {
        super()
        this.state = {
            trips: []
        }
    }

    componentDidMount(){
        var tripsRef = db.collection("trips")
        const sidebarComp = this;
        var usersRef = tripsRef.where(`users.${this.props.userId}`, '==', true)
            .onSnapshot(function (querySnapshot) {
                var trips = [];
                querySnapshot.forEach(function (doc) {
                    trips.push({[doc.data().name]: doc.id});
                });
                console.log('trips inside the snapshot are...', trips);
                sidebarComp.setState({trips})
            });
    }
//
    render(){
    var trips = this.state.trips;
    console.log('inside sidebar render with props: ', this.props);
    // console.log('sidebar has props...', this.props);
    return (
        <div className="sidebar">
        <SideNav
            trigger={<Button id="sidebarButton"><i className="material-icons">menu</i></Button>}
            options={{ closeOnClick: true }} >
                {/* used onClick instead of nested Link because browser console complains about nested a tags */}
                <SideNavItem onClick={() => {this.props.history.push('/')}} >My Account</SideNavItem>
                <SideNavItem onClick={() => { this.props.logout(); this.props.history.push('/') }}>Log Out</SideNavItem>
                <SideNavItem divider />
                <SideNavItem subheader>My Trips</SideNavItem>
                {
                    trips.map(trip => {
                        return (
                            <h5 key={Object.values(trip)[0]} className="trip-item menu-item">
                                <Link to={`/${Object.values(trip)[0]}`}>{Object.keys(trip)[0]}</Link>
                            </h5>
                        );
                    })
                }
                <SideNavItem divider />
                <SideNavItem subheader>+ Add Trip</SideNavItem>
                <AddTrip userid={this.props.userId} />
        </SideNav>
        </div>
        );
    }
}

export default withRouter(Sidebar);
