import React, {
  View,
  StyleSheet,
  Component,
  Text
 } from 'react-native';

import SignIn from './containers/signIn';
import SignOut from './containers/signOut';
import Button from './components/button';

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

  handleIncrement() {
    ddpClient.call('addPost');
  }

  handleDecrement() {
    ddpClient.call('deletePost');
  }

  handleSignedInStatus(status = false) {
    this.setState({ signedIn: status });
  }

  render() {
    let count = Object.keys(this.state.posts).length;
    let { connected, signedIn } = this.state;
    if (connected && signedIn) {
      return (
        <View style={styles.container}>
          <SignOut
            changedSignedIn={(status) => this.handleSignedInStatus(status)}
            count={count}
            />
          <View style={styles.view}>
            <Button
            text="+"
            onPress={this.handleIncrement.bind(this)} />
            <Button
            text="-"
            onPress={this.handleDecrement.bind(this)} />
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
