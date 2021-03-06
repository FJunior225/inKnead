import React, { Component } from 'react';
import { View, ListView, RefreshControl, Text, StyleSheet } from 'react-native';
import Landing from './Landing';
import Request from './Request';

export default class History extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      refreshing: false,
      loading: true,
      dataSource: ds.cloneWithRows(this._genRows({})),
      errorMessage: ' ',
    }
  }
  _onRefresh() {
    const userID = this.props.user.id
    console.log("userID", userID);
    // this.setState({loading: !this.state.loading})
    this.setState({refreshing: true});
    fetch(`http://192.168.0.101.xip.io:3000/users/${userID}`)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.sumDonatedPizzas(responseJson.totalDonatedPizzas)
      this.props.handleWelcomeUrl(responseJson.url)
      if (responseJson.errorMessage) {
        this.setState({errorMessage: responseJson.errorMessage})
      } else {
        this.props.collectUserHistory(responseJson.userHistory)
        this.setState({errorMessage: "Requests recieved."})
        // this.setState({loading: !this.state.loading})
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(this._genRows({}))})
      }
    })
    .catch((error) => {
      console.error(error);
    });
    this.setState({refreshing: false});
  }
  componentWillMount() {
    if (this.props.userHistory === null) {
      const userID = this.props.user.id
      console.log("userID", userID);
      fetch(`http://192.168.0.101.xip.io:3000/users/${userID}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.sumDonatedPizzas(responseJson.totalDonatedPizzas)
        this.props.handleWelcomeUrl(responseJson.url)
        if (responseJson.errorMessage) {
          this.setState({errorMessage: responseJson.errorMessage})
        } else {
          this.props.collectUserHistory(responseJson.userHistory)
          this.setState({errorMessage: "Requests recieved."})
          this.setState({loading: !this.state.loading})
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({dataSource: ds.cloneWithRows(this._genRows({}))})
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      this.setState({loading: !this.state.loading})
    }
  }
  _renderRow(rowData) {
    return <Request selectedRequest={this.props.userHistory[rowData]} {...this.props} />
  }
  _genRows() {
    if (this.props.userHistory) {
      let requestsLength = this.props.userHistory.length
      let result = [];
      for (let i = 0; i < requestsLength; i += 1) {
        result.push(i)
      }
      return result
    } else {
      return [0]
    }
  }
  render() {
    // if (this.state.errorMessage === "No current requests.") {
    //   display =
    //     <Landing noRequests key={"welcome"} {...this.props} />
    // } else if (this.state.errorMessage === "Requests recieved.") {
    //   display =
    //       {this.props.requests.map((request, i) => {
    //         return (
    //           <Request key={i} request={request} {...this.props} />
    //         )
    //       })}
    //     display.props.children.unshift(showWelcomePage);
    //   <Landing noRequests key={"welcome"} {...this.props} />
    // }

    let display;
    if (this.state.loading) {
      display =
          <Text>Loading...</Text>
    } else {
      display =
          <ListView
            style={styles.listViewContainer}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                />
            }
            />
    }
    // this._renderRow.bind(this, 0)
    // (rowData) => <Text>{rowData}</Text>
    return (
      <View style={styles.container}>
        {display}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'green',
  },
  listViewContainer: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 3,
  },
  wrapper: {
    marginTop: 50,
    // flex: 1,
    // borderWidth: 3,
    borderColor: 'red',
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 100,
  },
});
