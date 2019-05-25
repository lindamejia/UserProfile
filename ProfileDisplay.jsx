import React, { Component } from "react";
import { Nav, NavItem, NavLink, Button } from "reactstrap";
import ProfileInfo from "./ProfileInfo";
import ProfileSettings from "./ProfileSettings";
import * as addressService from "../../services/addressService";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import * as styles from "./profile.module.css";
import logger from "../../logger";
import SweetAlertSuccess from "../ui/SweetAlertWarning";
import SweetAlertWarning from "../ui/SweetAlertWarning";

const _logger = logger.extend("ProfileDisplay");

class ProfileDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      showInfo: true,
      showSettings: false,
      influencer: "",
      existing: false,
      insertModal: false,
      address: {},
      showSuccess: false,
      showError: false,
      city: "",
      modal: false
    };
  }

  // toggle = () => {
  //   this.setState({
  //     insertModal: !this.state.insertModal
  //   });
  // };

  componentDidMount() {
    console.log(this.props);
    this.showSettingsOnMount();
    this.influencerCheck();
    this.getAddress();
  }

  influencerCheck = () => {
    this.props.currentRoles.includes("Influencer")
      ? this.setState({ influencer: "You are an Influencer" })
      : this.setState({
          influencer: (
            <Button
              className="btn btn-warning waves-effect waves-light m-r-10"
              size="md"
              onClick={() => this.becomeInfluencer()}
            >
              Become an Influencer
            </Button>
          )
        });
  };

  getAddress = () => {
    addressService
      .handleGetByUserId()
      .then(this.getAddressSuccess)
      .catch(this.getAddressError);
  };

  getAddressSuccess = success => {
    _logger(success);
    this.setState({
      address: {
        lineOne: success.item.lineOne,
        lineTwo: success.item.lineTwo,
        zip: success.item.zip,
        city: success.item.city
      }
    });
  };

  getAddressError = error => {
    _logger(error);
  };

  influencerError = error => {
    _logger(error);
    this.setState({
      influencer: "You are not an influencer"
    });
  };

  showSettingsOnMount = () => {
    if (this.props.location.pathname === "/settings") {
      this.setState({ showSettings: !this.showSettings, showInfo: false });
    } else {
      return null;
    }
  };

  getDate = longDate => {
    let date = new Date(longDate);
    return (
      date.getUTCMonth() +
      1 +
      "/" +
      date.getUTCDate() +
      "/" +
      date.getFullYear()
    );
  };

  pushToMerchantApplication = () => {
    this.props.history.push("/merchants/application");
  };

  becomeInfluencer = () => {
    window.location.assign(
      "https://api.instagram.com/oauth/authorize/?client_id=8b9252bfd9174c99a5528f0454d82298&redirect_uri=https://" +
        window.location.host +
        "/ig/redirect&response_type=code"
    );
  };
  openSuccessAlert = () => {
    this.setState({ showSuccess: true });
  };

  openErrorAlert = () => {
    this.setState({ showError: true });
  };

  closeSuccessAlert = () => {
    this.setState({ showSuccess: false });
  };

  closeErrorAlert = () => {
    this.setState({ showError: false });
  };

  render() {
    return (
      <div>
        <React.Fragment>
          {this.state.showSuccess ? (
            <SweetAlertSuccess
              title="Your profile has been updated"
              message=""
              type="success"
              confirmBtnText="OK"
              confirmBtnStyle="default"
              confirmAction={this.closeSuccessAlert}
            />
          ) : null}
          {this.state.showError ? (
            <SweetAlertWarning
              title="Something went wrong"
              message=""
              type="danger"
              confirmBtnText="OK"
              confirmBtnStyle="default"
              cancelBtnText="Cancel"
              confirmAction={this.closeErrorAlert}
              cancelAction={this.closeErrorAlert}
            />
          ) : null}
          <div className="row">
            <div className="col-lg-4 col-xlg-3 col-md-5">
              <div className="card">
                <div className="card-body">
                  <center className="m-t-30 ">
                    {" "}
                    <img
                      name="avatarUrl"
                      src={
                        this.props.photo
                          ? this.props.user.avatarUrl
                          : "https://sabio-s3.s3.us-west-2.amazonaws.com/outlayr/d70ba21a-35fa-467e-a83f-12e0a36bf61c-lyovy1550778030.jpg"
                      }
                      style={{ borderRadius: "100%" }}
                      width="150"
                      alt="AvatarURL"
                    />
                    <br />
                    <h4 className="card-title mt-3">
                      <span>{this.props.user.firstName}</span>
                      <span> {this.props.user.lastName}</span>
                    </h4>
                    <h6 className="card-subtitle mt-3" name="description">
                      {this.props.user.description}
                    </h6>
                  </center>
                </div>
                <hr />
                <div className="card-body">
                  {" "}
                  <small className="text-muted" name="emailAdress">
                    Email address{" "}
                  </small>
                  <h6>{this.props.user.email}</h6>{" "}
                  <small className="text-muted" id="dob">
                    Date of Birth{" "}
                  </small>
                  <h6>
                    <output type="date">
                      {this.getDate(this.props.user.dob)}
                    </output>
                  </h6>{" "}
                  <small className="text-muted p-t-30 db" name="phoneNumber">
                    Phone
                  </small>
                  <h6>{this.props.user.phoneNumber}</h6>{" "}
                  <small className="text-muted p-t-30 db" name="address">
                    Address
                  </small>
                  <h6>
                    {this.state.address
                      ? `${this.state.address.lineOne} ${
                          this.state.address.lineTwo === ""
                            ? ", "
                            : this.state.address.lineTwo + ", "
                        } ${this.state.address.zip}, ${this.state.address.city}`
                      : "No Address"}{" "}
                  </h6>
                  <div className="map-box" />{" "}
                  <small className="text-muted p-t-30 db">Social Profile</small>
                  <br />
                  <button
                    className="btn btn-circle btn-info"
                    style={{ padding: "2px", margin: "5px" }}
                    onClick={() => this.becomeInfluencer()}
                  >
                    <i className="fab fa-instagram" />
                  </button>
                  <Button
                    disabled
                    className="btn btn-circle btn-secondary"
                    style={{ padding: "2px", margin: "5px" }}
                  >
                    <i className="fab fa-twitter" />
                  </Button>
                  <Button
                    disabled
                    className="btn btn-circle btn-secondary"
                    style={{ padding: "2px", margin: "5px" }}
                  >
                    <i className="fab fa-facebook" />
                  </Button>
                  <Button
                    disabled
                    className="btn btn-circle btn-secondary"
                    style={{ padding: "2px", margin: "5px" }}
                  >
                    <i className="fab fa-youtube" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-xlg-9 col-md-7">
              <div className="card">
                <Nav className="nav nav-tabs profile-tab" role="tablist">
                  <NavItem className={`"nav-item" ${styles.navTab}`}>
                    <NavLink
                      className="nav-link"
                      data-toggle="tab"
                      role="tab"
                      aria-haspopup="true"
                      aria-expanded="false"
                      onClick={() =>
                        this.setState({
                          showInfo: !this.showInfo,
                          showSettings: false
                        })
                      }
                    >
                      Profile
                    </NavLink>
                  </NavItem>
                  <NavItem className={`"nav-item" ${styles.navTab}`}>
                    <NavLink
                      className="nav-link"
                      data-toggle="tab"
                      role="tab"
                      onClick={() =>
                        this.setState({
                          showSettings: !this.showSettings,
                          showInfo: false
                        })
                      }
                    >
                      Settings
                    </NavLink>
                  </NavItem>
                  <NavItem className={`"nav-item" ${styles.navTab}`}>
                    <NavLink
                      // href="/components/"
                      className="nav-link"
                      data-toggle="tab"
                      // to="/Timeline"
                      role="tab"
                      onClick={() => this.becomeInfluencer()}
                    >
                      {!this.props.currentRoles.includes("Influencer")
                        ? "Become An Influencer"
                        : "My Instagram"}
                    </NavLink>
                  </NavItem>

                  <NavItem className={`"nav-item" ${styles.navTab}`}>
                    <NavLink
                      // href="/components/"
                      className="nav-link"
                      data-toggle="tab"
                      // to="/Timeline"
                      role="tab"
                      onClick={() => this.pushToMerchantApplication()}
                    >
                      Become A Merchant
                    </NavLink>
                  </NavItem>
                </Nav>
                {this.state.showInfo && (
                  <ProfileInfo
                    {...this.props}
                    address={this.state.address}
                    influencer={this.state.influencer}
                  />
                )}
                {this.state.showSettings && (
                  <ProfileSettings
                    openErrorAlert={this.openErrorAlert}
                    openSuccessAlert={this.openSuccessAlert}
                    {...this.props}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

ProfileDisplay.propTypes = {
  user: PropTypes.object,
  photo: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  currentRoles: PropTypes.array
};

export default withRouter(ProfileDisplay);
