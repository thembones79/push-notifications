import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity
} from "react-native";
import { Permissions, Notifications } from "expo";

const PUSH_REGISTRATION_ENDPOINT = "http://generated-ngrok-url/token";
const MESSAGE_ENDPIONT = "http://generated-ngrok-url/message";

export default class App extends React.Component {
  state = {
    notification: null,
    messageText: ""
  };

  registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: {
          value: token
        },
        user: {
          username: "warly",
          name: "Dan Ward"
        }
      })
    });

    this.notificationSubscription = Notifications.addListener(
      this.handleNotification
    );
  };

  handleNotification = notification => {
    this.setState({ notification });
  };

  handleChangeText = (text) =>{
    this.setState({messageText:text});
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.messageText}
          onChangeText={this.handleChangeText}
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.button} onPress={this.sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        {this.state.notification ? this.renderNotification() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
