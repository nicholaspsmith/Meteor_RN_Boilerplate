import React, {
  View,
  Component,
  Text
 } from 'react-native';

import SignIn from './containers/signIn';
import SignOut from './containers/signOut';

import ddpClient from './ddp';

export default class RNApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      signedIn: false,
      posts: {}
    };
  }

  componentWillMount() {
    ddpClient.connect((error, wasReconnect) => {
      if (error) {
        this.setState({connected: false});
      } else {
        this.setState({connected: true});
        ddpClient.loginWithToken((err, res) => {
          if (!err) {
            this.handleSignedInStatus(true);
            this.makeSubscription();
            this.observePosts();
          }
        });
      }
    });
  }

  makeSubscription() {
    ddpClient.subscribe('posts', [], () => {
      this.setState({posts: ddpClient.collections.posts});
    });
  }

  observePosts() {
    let observer = ddpClient.observe("posts");
    observer.added = (id) => {
      this.setState({posts: ddpClient.collections.posts})
    }
    observer.changed = (id, oldFields, clearedFields, newFields) => {
      this.setState({posts: ddpClient.collections.posts})
    }
    observer.removed = (id, oldValue) => {
      this.setState({posts: ddpClient.collections.posts})
    }
  }

  handleIncrement() {}
  
  handleDecrement() {}

  handleSignedInStatus(status = false) {
    this.setState({ signedIn: status });
  }

  render() {
    let count = Object.keys(this.state.posts).length;
    let { connected, signedIn } = this.state;
    if (connected && signedIn) {
      return (
          <SignOut
            changedSignedIn={(status) => this.handleSignedInStatus(status)}
            count={count}
            />
      );
    } else {
      return (
        <SignIn
          connected={connected}
          changedSignedIn={(status) => this.handleSignedInStatus(status)}
          />
      );
    }
  }
}
