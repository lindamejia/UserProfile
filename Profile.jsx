import React, { Component } from "react";
import ProfileForm from "./ProfileForm";
import * as profileService from "../../services/profileService";
import ProfileDisplay from "./ProfileDisplay";

class ProfileH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      existing: false,
      photo: true
    };
  }

  componentDidMount() {
    this.loadDisplay();
    console.log(this.props);
  }

  loadDisplay = () => {
    profileService
      .getByUserId()
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdFail);
  };

  onGetByIdSuccess = data => {
    console.log(`Successful GRAB BY ID. ID: ${data.item.id}`, data);
    const res = data.item;
    if (res.avatarUrl === "") {
      this.setState({
        photo: false
      });
    }
    this.setState({
      user: {
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        avatarUrl: res.avatarUrl,
        description: res.description,
        dob: res.dob,
        phoneNumber: res.phoneNumber,
        email: res.email
      },
      existing: true
    });
  };

  onGetByIdFail = error => {
    console.log(`something went wrong when trying to grab this post`, error);
  };

  render() {
    return (
      <div>
        {this.state.existing ? (
          <div>
            <ProfileDisplay
              //{...this.props} is already passing a user object
              // user={this.state.user}
              photo={this.state.photo}
              {...this.props}
            />
          </div>
        ) : (
          <div>
            <ProfileForm />
          </div>
        )}
      </div>
    );
  }
}

export default ProfileH;
