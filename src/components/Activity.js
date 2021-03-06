import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons';

export default class Activity extends Component {
  render() {
    const scope = [
      "Global",
      "Private",
    ]
    return (
      <View style={styles.container}>
        <SegmentedControls
          tint={'#ce0000'}
          options={ scope }
          onSelection={ this.props.changeScope.bind(this) }
          selectedOption={ this.props.currentScope }
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'purple',
  },
})
